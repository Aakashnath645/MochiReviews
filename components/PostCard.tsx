"use client";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import Mochimeter from "./Mochimeter";

type Props = {
    post: Post;
    index?: number;
};

export default function PostCard({ post, index = 0 }: Props) {
    const stagger = Math.min(index + 1, 6);

    return (
        <Link
            href={`/posts/${post.slug}`}
            className={`card animate-fade-in stagger-${stagger}`}
            style={{
                display: "block",
                overflow: "hidden",
                textDecoration: "none",
                transform: "translateY(0)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
        >
            {/* Cover image */}
            {post.cover_image && (
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                        sizes="(max-width: 600px) 100vw, 50vw"
                    />
                </div>
            )}

            <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
                    <CategoryBadge category={post.category} />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {formatDate(post.created_at)}
                    </span>
                </div>

                <h2
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        marginBottom: "0.5rem",
                        color: "var(--color-text)",
                    }}
                >
                    {post.title}
                </h2>

                {post.excerpt && (
                    <p
                        style={{
                            fontSize: "0.875rem",
                            color: "var(--color-text-muted)",
                            lineHeight: 1.55,
                            marginBottom: "1rem",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {post.excerpt}
                    </p>
                )}

                <Mochimeter score={post.score} size="sm" />
            </div>
        </Link>
    );
}
