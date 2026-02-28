import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "mochi.db");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

let _db: Database.Database | null = null;

function getDb(): Database.Database {
    if (!_db) {
        _db = new Database(DB_PATH);
        _db.pragma("journal_mode = WAL");
        _db.pragma("foreign_keys = ON");
        initializeSchema(_db);
    }
    return _db;
}

function initializeSchema(db: Database.Database): void {
    // Check whether the posts table already exists
    const tableInfo = db
        .prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='posts'")
        .get() as { sql: string } | undefined;

    if (!tableInfo) {
        // Fresh install — create without a hardcoded category restriction
        db.exec(`
      CREATE TABLE posts (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT NOT NULL,
        slug        TEXT NOT NULL UNIQUE,
        excerpt     TEXT,
        content     TEXT NOT NULL DEFAULT '',
        category    TEXT NOT NULL,
        cover_image TEXT DEFAULT '',
        score       REAL NOT NULL DEFAULT 0 CHECK(score >= 0 AND score <= 10),
        status      TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
        created_at  TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
    } else if (tableInfo.sql.includes("category IN (")) {
        // Migration: recreate table without the old hardcoded category CHECK constraint
        db.exec(`
      BEGIN TRANSACTION;
      CREATE TABLE posts_new (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT NOT NULL,
        slug        TEXT NOT NULL UNIQUE,
        excerpt     TEXT,
        content     TEXT NOT NULL DEFAULT '',
        category    TEXT NOT NULL,
        cover_image TEXT DEFAULT '',
        score       REAL NOT NULL DEFAULT 0 CHECK(score >= 0 AND score <= 10),
        status      TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
        created_at  TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );
      INSERT INTO posts_new SELECT * FROM posts;
      DROP TABLE posts;
      ALTER TABLE posts_new RENAME TO posts;
      COMMIT;
    `);
    }
    // else: table already exists without the old constraint — nothing to do
}

export type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string; // any string — primary or custom
    cover_image: string | null;
    score: number;
    status: "draft" | "published";
    created_at: string;
    updated_at: string;
};

export type PostInput = Omit<Post, "id" | "created_at" | "updated_at">;

// --- Public queries ---

export function getAllPublishedPosts(category?: string): Post[] {
    const db = getDb();
    if (category) {
        return db
            .prepare(
                "SELECT * FROM posts WHERE status = 'published' AND category = ? ORDER BY created_at DESC"
            )
            .all(category) as Post[];
    }
    return db
        .prepare(
            "SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC"
        )
        .all() as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
    const db = getDb();
    return db
        .prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'")
        .get(slug) as Post | undefined;
}

// --- Admin queries ---

export function getAllPosts(): Post[] {
    const db = getDb();
    return db
        .prepare("SELECT * FROM posts ORDER BY created_at DESC")
        .all() as Post[];
}

export function getPostById(id: number): Post | undefined {
    const db = getDb();
    return db
        .prepare("SELECT * FROM posts WHERE id = ?")
        .get(id) as Post | undefined;
}

export function createPost(data: PostInput): Post {
    const db = getDb();
    const result = db
        .prepare(
            `INSERT INTO posts (title, slug, excerpt, content, category, cover_image, score, status)
       VALUES (@title, @slug, @excerpt, @content, @category, @cover_image, @score, @status)`
        )
        .run(data);
    return getPostById(result.lastInsertRowid as number)!;
}

export function updatePost(id: number, data: Partial<PostInput>): Post {
    const db = getDb();
    const existing = getPostById(id);
    if (!existing) throw new Error(`Post ${id} not found`);

    const merged = { ...existing, ...data };
    db.prepare(
        `UPDATE posts SET
      title = @title, slug = @slug, excerpt = @excerpt, content = @content,
      category = @category, cover_image = @cover_image, score = @score,
      status = @status, updated_at = datetime('now')
     WHERE id = @id`
    ).run({ ...merged, id });

    return getPostById(id)!;
}

export function deletePost(id: number): void {
    const db = getDb();
    db.prepare("DELETE FROM posts WHERE id = ?").run(id);
}

export function slugExists(slug: string, excludeId?: number): boolean {
    const db = getDb();
    if (excludeId) {
        return !!db
            .prepare("SELECT 1 FROM posts WHERE slug = ? AND id != ?")
            .get(slug, excludeId);
    }
    return !!db.prepare("SELECT 1 FROM posts WHERE slug = ?").get(slug);
}

/** Returns all distinct categories that have at least one published post */
export function getAllCategories(): string[] {
    const db = getDb();
    return (
        db
            .prepare(
                "SELECT DISTINCT category FROM posts WHERE status = 'published' ORDER BY category"
            )
            .all() as { category: string }[]
    ).map((r) => r.category);
}
