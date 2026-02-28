import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "About MochiReviews — a personal blog covering games, books, TV shows, movies, and music.",
};

export default function AboutPage() {
    return (
        <div style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            <div className="container-main" style={{ maxWidth: "680px" }}>

                <div
                    className="animate-fade-in"
                    style={{
                        textAlign: "center",
                        padding: "3rem 2rem",
                        backgroundColor: "var(--color-primary-container)",
                        borderRadius: "var(--radius-xl)",
                        marginBottom: "2.5rem",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍡</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
                        About MochiReviews
                    </h1>
                    <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                        A personal corner of the internet for honest reviews on the things I actually spend time with.
                    </p>
                </div>

                <div className="card animate-fade-in stagger-2" style={{ padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "1rem" }}>
                        What is this place?
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, marginBottom: "1rem" }}>
                        MochiReviews is a single-author blog where I write detailed, personal reviews of the media I consume —
                        from epic JRPG campaigns and slow-burn mystery novels to binge-worthy TV seasons and obscure music albums.
                    </p>
                    <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                        Every review ends with a <strong style={{ color: "var(--color-primary)" }}>Mochimeter score</strong> — my custom 10-point scale
                        rendered as cute mochi blobs. It&apos;s more fun than stars, and more precise than a simple thumbs-up.
                    </p>
                </div>

                <div className="card animate-fade-in stagger-3" style={{ padding: "2rem", marginTop: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "1rem" }}>
                        🍡 The Mochimeter
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, marginBottom: "1rem" }}>
                        Scores run from 0.0 to 10.0 in half-point increments. Each filled blob represents one point.
                        A half-filled blob means 0.5. It&apos;s a simple scale with a fun face.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {[
                            { range: "9.0 – 10.0", label: "Essential", color: "var(--color-secondary)" },
                            { range: "7.0 – 8.5", label: "Recommended", color: "var(--color-primary)" },
                            { range: "5.0 – 6.5", label: "Decent", color: "var(--color-text-muted)" },
                            { range: "0.0 – 4.5", label: "Skip it", color: "#8B3A20" },
                        ].map(({ range, label, color }) => (
                            <div key={range} style={{
                                padding: "0.6rem 1rem",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--color-surface-2)",
                                border: "1px solid var(--color-border)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.15rem",
                            }}>
                                <span style={{ fontWeight: 700, fontSize: "0.95rem", color }}>{label}</span>
                                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{range}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card animate-fade-in stagger-4" style={{ padding: "2rem", marginTop: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "1rem" }}>
                        What I cover
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                        {[
                            { emoji: "🎮", label: "Video Games" },
                            { emoji: "📚", label: "Books" },
                            { emoji: "📺", label: "TV Shows" },
                            { emoji: "🎬", label: "Movies" },
                            { emoji: "🎵", label: "Music Albums" },
                        ].map(({ emoji, label }) => (
                            <div key={label} style={{
                                padding: "1rem",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--color-surface-2)",
                                border: "1px solid var(--color-border)",
                                textAlign: "center",
                            }}>
                                <div style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>{emoji}</div>
                                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
