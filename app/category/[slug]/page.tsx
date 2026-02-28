import { getAllPublishedPosts } from "@/lib/db";
import PostCard from "@/components/PostCard";
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const label = CATEGORY_LABELS[slug] || slug;
    return {
        title: `${label} Reviews`,
        description: `All ${label.toLowerCase()} reviews on MochiReviews.`,
    };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    // Allow any category slug — primary or custom
    const posts = getAllPublishedPosts(slug);

    const label = CATEGORY_LABELS[slug] || slug;
    const emoji = CATEGORY_EMOJIS[slug] || "📝";

    return (
        <div style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
            <div className="container-main">

                {/* Header */}
                <div
                    className="animate-fade-in"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "2rem 1.75rem",
                        backgroundColor: "var(--color-primary-container)",
                        borderRadius: "var(--radius-xl)",
                        marginBottom: "2.5rem",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <span style={{ fontSize: "2.5rem" }}>{emoji}</span>
                    <div>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                            {label} Reviews
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                            {posts.length} {posts.length === 1 ? "review" : "reviews"} published
                        </p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-muted)" }}>
                        <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                            No &ldquo;{label}&rdquo; reviews yet.
                        </p>
                        <p style={{ fontSize: "0.875rem" }}>Check back soon! 🍡</p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.25rem",
                    }}>
                        {posts.map((post, i) => (
                            <PostCard key={post.id} post={post} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
