import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE_MB = 8;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "File type not allowed. Use JPEG, PNG, WebP, GIF, or AVIF." },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${MAX_SIZE_MB}MB.` },
                { status: 400 }
            );
        }

        const blob = await put(file.name, file, {
            access: "public",
            addRandomSuffix: true,
        });

        return NextResponse.json({ url: blob.url });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
