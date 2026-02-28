import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "mochi.db");

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    excerpt     TEXT,
    content     TEXT NOT NULL DEFAULT '',
    category    TEXT NOT NULL CHECK(category IN ('game','book','tv','movie','music')),
    cover_image TEXT DEFAULT '',
    score       REAL NOT NULL DEFAULT 0 CHECK(score >= 0 AND score <= 10),
    status      TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const existing = db.prepare("SELECT id FROM posts WHERE slug = ?").get("the-miroku-murder-case");
if (existing) {
    console.log("⚠️  Seed post already exists. Skipping.");
    process.exit(0);
}

const content = `
<h2>A Labyrinthine Mystery in the Fog of Kyoto</h2>
<p>There are detective novels that merely entertain, and then there are those that quietly burrow under your skin and refuse to leave. <em>The Miroku Murder Case</em> by the fictional novelist Etsuko Narimura belongs firmly in the latter category. I picked this one up on a whim from a second-hand shelf in Jimbocho, expecting a pleasant rainy-afternoon read. What I got was four sleepless nights and a profound new appreciation for the architecture of the Japanese mystery genre.</p>

<h2>The Setup</h2>
<p>The novel opens on a cold November morning when a renowned Buddhist art restorer is found dead inside the sealed restoration chamber of a Kyoto temple — slumped beneath a half-finished statue of Miroku, the Future Buddha. The chamber was locked. The windows shuttered from within. No weapon. No apparent motive beyond a web of professional jealousy and decades-old secrets.</p>
<p>Enter Detective Tsuruga Haruki: middle-aged, perpetually rumpled, an ex-art-history student who traded lectures for a badge. He is the rare breed of fictional detective whose intelligence feels <em>earned</em> rather than asserted. He doesn't monologue his brilliance — he fumbles, second-guesses, and occasionally misreads people. That makes his eventual breakthrough feel genuinely electrifying.</p>

<blockquote><p>"A locked room is not a puzzle to be solved," Tsuruga murmured, running his thumb along the door's worn lacquer. "It is a statement. Someone wanted us to ask <em>how</em>, so that we would never think to ask <em>why</em>."</p></blockquote>

<h2>What Works Brilliantly</h2>
<p>Narimura's greatest achievement is the layering of her clues. On a first read, every piece of physical evidence seems mundane — a displaced scroll, a faint smell of cedar oil, the victim's peculiar choice of footwear. On reflection, after the reveal, each detail snaps into place with surgical precision. This is a novel that rewards re-reading almost immediately after you finish it.</p>
<p>The Kyoto setting is rendered with quiet intimacy rather than tourist-brochure gloss. Temple bureaucracy, the cutthroat economics of cultural preservation funding, and the complex social hierarchies among artisans all become genuine plot elements rather than decorative backdrop. The mystery could <em>only</em> happen in this specific world, and that specificity is what elevates it.</p>

<h2>Minor Reservations</h2>
<p>The middle third sags slightly under the weight of too many suspects introduced too briefly. A rival curator, a disgraced apprentice, and a temple administrator rotate through so quickly that keeping their motivations distinct requires active effort. A sharper editorial hand could have trimmed one subplot without losing anything the final act depends on.</p>
<p>Additionally, a subplot involving the detective's estranged daughter never quite integrates with the case and feels like a pilot for a character study that didn't make it into this volume.</p>

<h2>The Verdict</h2>
<p><em>The Miroku Murder Case</em> is a richly constructed, atmospherically dense locked-room mystery that earns its final revelation through patience and intellectual rigor. It is not a light or breezy read — it asks something of you. But what it gives back is the rare satisfaction of a story where everything, in the end, makes complete and inevitable sense.</p>
<p>Highly recommended for fans of Seishi Yokomizo, Soji Shimada, and anyone who believes that the best mysteries are, at their core, stories about the weight of the past on the living.</p>
`;

db.prepare(`
  INSERT INTO posts (title, slug, excerpt, content, category, cover_image, score, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-3 days'), datetime('now', '-3 days'))
`).run(
    "The Miroku Murder Case",
    "the-miroku-murder-case",
    "A locked-room mystery set in a Kyoto temple that manages to be both intellectually rigorous and deeply atmospheric. Detective Tsuruga Haruki investigates the impossible death of a Buddhist art restorer found beneath the Future Buddha himself.",
    content.trim(),
    "book",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    8.5,
    "published"
);

console.log("✅ Seeded successfully: 'The Miroku Murder Case'");
db.close();
