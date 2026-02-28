import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const posts = getAllPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, slug, excerpt, content, category, cover_image, score, status } = body;

        if (!title || !content || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const finalSlug = slug || slugify(title);
        const post = createPost({
            title,
            slug: finalSlug,
            excerpt: excerpt || null,
            content,
            category,
            cover_image: cover_image || null,
            score: parseFloat(score) || 0,
            status: status || "draft",
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error && error.message.includes("UNIQUE")) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
