import { getPostById } from "@/lib/db";
import { notFound } from "next/navigation";
import PostForm from "@/components/editor/PostForm";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = await getPostById(Number(id));
    return { title: post ? `Edit: ${post.title} — Admin` : "Edit Post — Admin" };
}

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: Props) {
    const { id } = await params;
    const post = await getPostById(Number(id));
    if (!post) notFound();

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                    Edit Post
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                    Editing: <strong>{post.title}</strong>
                </p>
            </div>
            <div className="card" style={{ padding: "2rem" }}>
                <PostForm
                    mode="edit"
                    initialData={{
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt || "",
                        content: post.content,
                        category: post.category,
                        cover_image: post.cover_image || "",
                        score: post.score,
                        status: post.status,
                    }}
                />
            </div>
        </div>
    );
}
