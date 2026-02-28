import { getAllPublishedPosts } from "@/lib/db";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getAllPublishedPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
      <div className="container-main">

        {/* Hero */}
        <section
          className="animate-fade-in"
          style={{
            textAlign: "center",
            padding: "3.5rem 1rem 3rem",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-accent-container) 100%)",
            marginBottom: "3rem",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🍡</div>
          <h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.2,
              marginBottom: "0.75rem",
              letterSpacing: "-0.03em",
            }}
          >
            MochiReviews
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--color-text-muted)", maxWidth: "480px", margin: "0 auto 1.75rem" }}>
            Honest takes on games, books, TV, movies, and music — scored with the Mochimeter.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/category/game", label: "🎮 Games" },
              { href: "/category/book", label: "📚 Books" },
              { href: "/category/tv", label: "📺 TV" },
              { href: "/category/movie", label: "🎬 Movies" },
              { href: "/category/music", label: "🎵 Music" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="btn-secondary" style={{ fontSize: "0.85rem" }}>
                {label}
              </Link>
            ))}
          </div>
        </section>

        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No posts yet.</p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon — the mochi is still baking. 🍡</p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
              ✨ Latest Review
            </h2>
            <PostCard post={featured} index={0} />
          </section>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <section>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
              📖 More Reviews
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}>
              {rest.map((post, i) => (
                <PostCard key={post.id} post={post} index={i + 1} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
