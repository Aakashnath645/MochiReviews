import PostForm from "@/components/editor/PostForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Post — Admin" };

export default function NewPostPage() {
    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                    New Post
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                    Write your review and publish or save as draft.
                </p>
            </div>
            <div className="card" style={{ padding: "2rem" }}>
                <PostForm mode="create" />
            </div>
        </div>
    );
}
