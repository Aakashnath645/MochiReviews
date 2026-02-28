"use client";
import { Post } from "@/lib/db";
import { formatDate, CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    const fetchPosts = async () => {
        const res = await fetch("/api/admin/posts");
        const data = await res.json();
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => { fetchPosts(); }, []);

    const deletePost = async (id: number) => {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        setDeleting(id);
        await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
        await fetchPosts();
        setDeleting(null);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                        All Posts
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                        {posts.length} total · {posts.filter(p => p.status === "published").length} published
                    </p>
                </div>
                <Link href="/admin/posts/new" className="btn-primary">
                    <Plus size={16} /> New Post
                </Link>
            </div>

            {loading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                    Loading posts…
                </div>
            ) : posts.length === 0 ? (
                <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🍡</div>
                    <p style={{ fontWeight: 600 }}>No posts yet!</p>
                    <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Create your first review.</p>
                    <Link href="/admin/posts/new" className="btn-primary" style={{ marginTop: "1.25rem", display: "inline-flex" }}>
                        <Plus size={16} /> New Post
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="card"
                            style={{
                                padding: "1.1rem 1.4rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Status dot */}
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: post.status === "published" ? "var(--color-secondary)" : "var(--color-text-muted)",
                                flexShrink: 0,
                            }} />

                            {/* Category emoji */}
                            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
                                {CATEGORY_EMOJIS[post.category]}
                            </span>

                            {/* Title + meta */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {post.title}
                                </p>
                                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>
                                    {CATEGORY_LABELS[post.category]} · Score: {post.score}/10 · {formatDate(post.updated_at)}
                                </p>
                            </div>

                            {/* Status badge */}
                            <span style={{
                                padding: "0.2rem 0.7rem",
                                borderRadius: "var(--radius-pill)",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                backgroundColor: post.status === "published" ? "var(--color-secondary-container)" : "var(--color-surface-2)",
                                color: post.status === "published" ? "var(--color-secondary)" : "var(--color-text-muted)",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }}>
                                {post.status === "published" ? <Eye size={10} /> : <EyeOff size={10} />}
                                {post.status}
                            </span>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                {post.status === "published" && (
                                    <Link href={`/posts/${post.slug}`} target="_blank" className="btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}>
                                        View
                                    </Link>
                                )}
                                <Link href={`/admin/posts/${post.id}/edit`} className="btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                    <Edit2 size={12} /> Edit
                                </Link>
                                <button
                                    onClick={() => deletePost(post.id)}
                                    disabled={deleting === post.id}
                                    className="btn-danger"
                                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                                >
                                    <Trash2 size={12} /> {deleting === post.id ? "…" : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
