import Link from "next/link";

export default function Footer() {
    return (
        <footer
            style={{
                marginTop: "5rem",
                borderTop: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                padding: "2.5rem 1.25rem",
            }}
        >
            <div
                className="container-main"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    textAlign: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>🍡</span>
                    <span
                        style={{
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            color: "var(--color-primary)",
                        }}
                    >
                        MochiReviews
                    </span>
                </div>
                <p
                    style={{
                        fontSize: "0.85rem",
                        color: "var(--color-text-muted)",
                        maxWidth: "400px",
                    }}
                >
                    Personal reviews on games, books, TV, movies & music. Written with
                    care, rated with mochi.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "1.5rem",
                        fontSize: "0.8rem",
                        color: "var(--color-text-muted)",
                    }}
                >
                    {[
                        { href: "/category/game", label: "🎮 Games" },
                        { href: "/category/book", label: "📚 Books" },
                        { href: "/category/tv", label: "📺 TV" },
                        { href: "/category/movie", label: "🎬 Movies" },
                        { href: "/category/music", label: "🎵 Music" },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                color: "var(--color-text-muted)",
                                fontWeight: 500,
                                transition: "color 0.2s",
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    © 2026 MochiReviews · Made with 🍡
                </p>
            </div>
        </footer>
    );
}
