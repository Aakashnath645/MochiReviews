import { getPostBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import Mochimeter from "@/components/Mochimeter";
import RichTextRenderer from "@/components/RichTextRenderer";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Not Found" };
    return {
        title: post.title,
        description: post.excerpt || undefined,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            images: post.cover_image ? [post.cover_image] : [],
        },
    };
}

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) notFound();

    return (
        <article style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
            <div className="container-main" style={{ maxWidth: "740px" }}>

                <a href="/" className="animate-fade-in" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)",
                    marginBottom: "1.75rem", transition: "color 0.2s",
                }}>
                    ← Back to Reviews
                </a>

                <div className="animate-fade-in stagger-1" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <CategoryBadge category={post.category} />
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {formatDate(post.created_at)}
                    </span>
                </div>

                <h1 className="animate-fade-in stagger-2" style={{
                    fontSize: "clamp(1.65rem, 4vw, 2.4rem)", fontWeight: 800, lineHeight: 1.25,
                    marginBottom: "1.25rem", color: "var(--color-text)", letterSpacing: "-0.03em",
                }}>
                    {post.title}
                </h1>

                <div className="animate-fade-in stagger-3" style={{
                    backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem", marginBottom: "2rem",
                    display: "inline-flex", flexDirection: "column", gap: "0.5rem",
                }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                        🍡 Mochimeter Score
                    </span>
                    <Mochimeter score={post.score} size="lg" />
                </div>

                {post.cover_image && (
                    <div className="animate-fade-in stagger-4" style={{
                        position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden",
                        borderRadius: "var(--radius-xl)", marginBottom: "2.5rem", border: "1px solid var(--color-border)",
                    }}>
                        <Image src={post.cover_image} alt={post.title} fill
                            style={{ objectFit: "cover" }} priority sizes="(max-width: 740px) 100vw, 740px" />
                    </div>
                )}

                {post.excerpt && (
                    <p className="animate-fade-in stagger-5" style={{
                        fontSize: "1.1rem", fontWeight: 500, color: "var(--color-text-muted)", lineHeight: 1.7,
                        marginBottom: "2rem", padding: "1rem 1.5rem", backgroundColor: "var(--color-surface-2)",
                        borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--color-secondary)",
                    }}>
                        {post.excerpt}
                    </p>
                )}

                <div className="animate-fade-in stagger-6">
                    <RichTextRenderer html={post.content} />
                </div>

                <div style={{
                    marginTop: "3.5rem", padding: "1.5rem",
                    backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)", textAlign: "center",
                }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                        Final Mochimeter Score
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Mochimeter score={post.score} size="md" />
                    </div>
                </div>

            </div>
        </article>
    );
}
