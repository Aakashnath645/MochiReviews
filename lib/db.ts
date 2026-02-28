import { neon } from "@neondatabase/serverless";

function getDb() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set.");
    }
    return neon(process.env.DATABASE_URL);
}

export type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string;
    cover_image: string | null;
    score: number;
    status: "draft" | "published";
    created_at: string;
    updated_at: string;
};

export type PostInput = Omit<Post, "id" | "created_at" | "updated_at">;

// ── Schema ────────────────────────────────────────────────────────────────────

export async function initDb(): Promise<void> {
    const sql = getDb();
    await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL UNIQUE,
      excerpt     TEXT,
      content     TEXT NOT NULL DEFAULT '',
      category    TEXT NOT NULL,
      cover_image TEXT DEFAULT '',
      score       FLOAT NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 10),
      status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

// ── Public queries ────────────────────────────────────────────────────────────

export async function getAllPublishedPosts(category?: string): Promise<Post[]> {
    const sql = getDb();
    if (category) {
        return (await sql`
      SELECT * FROM posts
      WHERE status = 'published' AND category = ${category}
      ORDER BY created_at DESC
    `) as Post[];
    }
    return (await sql`
    SELECT * FROM posts
    WHERE status = 'published'
    ORDER BY created_at DESC
  `) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const sql = getDb();
    const rows = await sql`
    SELECT * FROM posts WHERE slug = ${slug} AND status = 'published'
  `;
    return rows[0] as Post | undefined;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
    const sql = getDb();
    return (await sql`
    SELECT * FROM posts ORDER BY created_at DESC
  `) as Post[];
}

export async function getPostById(id: number): Promise<Post | undefined> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM posts WHERE id = ${id}`;
    return rows[0] as Post | undefined;
}

export async function createPost(data: PostInput): Promise<Post> {
    const sql = getDb();
    const rows = await sql`
    INSERT INTO posts (title, slug, excerpt, content, category, cover_image, score, status)
    VALUES (
      ${data.title}, ${data.slug}, ${data.excerpt ?? null}, ${data.content},
      ${data.category}, ${data.cover_image ?? null}, ${data.score}, ${data.status}
    )
    RETURNING *
  `;
    return rows[0] as Post;
}

export async function updatePost(id: number, data: Partial<PostInput>): Promise<Post> {
    const existing = await getPostById(id);
    if (!existing) throw new Error(`Post ${id} not found`);

    const merged: PostInput = {
        title: data.title ?? existing.title,
        slug: data.slug ?? existing.slug,
        excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
        content: data.content ?? existing.content,
        category: data.category ?? existing.category,
        cover_image: data.cover_image !== undefined ? data.cover_image : existing.cover_image,
        score: data.score ?? existing.score,
        status: data.status ?? existing.status,
    };

    const sql = getDb();
    const rows = await sql`
    UPDATE posts SET
      title       = ${merged.title},
      slug        = ${merged.slug},
      excerpt     = ${merged.excerpt ?? null},
      content     = ${merged.content},
      category    = ${merged.category},
      cover_image = ${merged.cover_image ?? null},
      score       = ${merged.score},
      status      = ${merged.status},
      updated_at  = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
    return rows[0] as Post;
}

export async function deletePost(id: number): Promise<void> {
    const sql = getDb();
    await sql`DELETE FROM posts WHERE id = ${id}`;
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const sql = getDb();
    if (excludeId) {
        const rows = await sql`
      SELECT 1 FROM posts WHERE slug = ${slug} AND id != ${excludeId}
    `;
        return rows.length > 0;
    }
    const rows = await sql`SELECT 1 FROM posts WHERE slug = ${slug}`;
    return rows.length > 0;
}

export async function getAllCategories(): Promise<string[]> {
    const sql = getDb();
    const rows = await sql`
    SELECT DISTINCT category FROM posts WHERE status = 'published' ORDER BY category
  `;
    return rows.map((r) => r.category as string);
}
