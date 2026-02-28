import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const post = getPostById(Number(id));
        if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(post);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { title, slug, excerpt, content, category, cover_image, score, status } = body;

        const finalSlug = slug || slugify(title);
        const post = updatePost(Number(id), {
            title,
            slug: finalSlug,
            excerpt: excerpt || null,
            content,
            category,
            cover_image: cover_image || null,
            score: parseFloat(score) || 0,
            status: status || "draft",
        });

        return NextResponse.json(post);
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error && error.message.includes("UNIQUE")) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        deletePost(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
