import { NextRequest, NextResponse } from "next/server";
import { getAllPublishedPosts } from "@/lib/db";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    try {
        const posts = getAllPublishedPosts(category);
        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
