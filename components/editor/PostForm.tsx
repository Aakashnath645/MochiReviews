"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { slugify } from "@/lib/utils";
import Mochimeter from "@/components/Mochimeter";
import { Save, Eye, Upload, Link as LinkIcon, X, ImageIcon } from "lucide-react";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), { ssr: false });

export type PostFormData = {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    cover_image: string;
    score: number;
    status: "draft" | "published";
};

type Props = {
    initialData?: Partial<PostFormData>;
    mode: "create" | "edit";
};

const PRIMARY_CATEGORIES = [
    { value: "game", label: "🎮 Video Game" },
    { value: "book", label: "📚 Book" },
    { value: "tv", label: "📺 TV Show" },
    { value: "movie", label: "🎬 Movie" },
    { value: "music", label: "🎵 Music Album" },
    { value: "__custom__", label: "✏️ Custom…" },
];

const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--color-border)",
    backgroundColor: "var(--color-surface-2)",
    color: "var(--color-text)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--color-text-muted)",
    marginBottom: "0.4rem",
    letterSpacing: "0.02em",
    textTransform: "uppercase" as const,
};

function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = "var(--color-primary)";
}
function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = "var(--color-border)";
}

export default function PostForm({ initialData, mode }: Props) {
    const router = useRouter();

    // Determine whether initial category is custom
    const isPrimaryCategory = PRIMARY_CATEGORIES.some(
        (c) => c.value === initialData?.category && c.value !== "__custom__"
    );
    const initialSelectValue = isPrimaryCategory ? (initialData?.category || "book") : "__custom__";
    const initialCustomValue = !isPrimaryCategory ? (initialData?.category || "") : "";

    const [form, setForm] = useState<PostFormData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        category: initialData?.category || "book",
        cover_image: initialData?.cover_image || "",
        score: initialData?.score ?? 7,
        status: initialData?.status || "draft",
    });

    const [categorySelect, setCategorySelect] = useState(initialSelectValue);
    const [customCategory, setCustomCategory] = useState(initialCustomValue);
    const [imageTab, setImageTab] = useState<"url" | "upload">("url");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto slug from title
    useEffect(() => {
        if (!slugManuallyEdited) {
            setForm((f) => ({ ...f, slug: slugify(f.title) }));
        }
    }, [form.title, slugManuallyEdited]);

    // Sync category from select + custom input
    useEffect(() => {
        if (categorySelect === "__custom__") {
            setForm((f) => ({ ...f, category: customCategory.trim() || "custom" }));
        } else {
            setForm((f) => ({ ...f, category: categorySelect }));
        }
    }, [categorySelect, customCategory]);

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        setUploadError("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setForm((f) => ({ ...f, cover_image: data.url }));
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageUpload(file);
    };

    const handleSubmit = async (e: React.FormEvent, saveStatus?: "draft" | "published") => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Title is required"); return; }
        if (!form.content.trim() || form.content === "<p></p>") { setError("Content is required"); return; }

        setLoading(true);
        setError("");
        const finalStatus = saveStatus || form.status;
        const body = { ...form, status: finalStatus };

        try {
            let res;
            if (mode === "create") {
                res = await fetch("/api/admin/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            } else {
                res = await fetch(`/api/admin/posts/${initialData?.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save");
            }

            router.push("/admin");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const set = (field: keyof PostFormData, value: string | number) =>
        setForm((f) => ({ ...f, [field]: value }));

    const tabBtn = (active: boolean): React.CSSProperties => ({
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.45rem 1rem",
        borderRadius: "var(--radius-pill)",
        fontSize: "0.8rem",
        fontWeight: 700,
        cursor: "pointer",
        border: "none",
        fontFamily: "var(--font-body)",
        backgroundColor: active ? "var(--color-primary)" : "transparent",
        color: active ? "var(--color-on-primary)" : "var(--color-text-muted)",
        transition: "all 0.15s ease",
    });

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "1.5rem" }}>

                {/* Title */}
                <div>
                    <label style={labelStyle}>Title *</label>
                    <input value={form.title} onChange={(e) => set("title", e.target.value)}
                        placeholder="e.g. The Miroku Murder Case" required style={fieldStyle}
                        onFocus={focus} onBlur={blur} />
                </div>

                {/* Slug */}
                <div>
                    <label style={labelStyle}>Slug *</label>
                    <input value={form.slug}
                        onChange={(e) => { setSlugManuallyEdited(true); set("slug", e.target.value); }}
                        placeholder="auto-generated-from-title" required
                        style={{ ...fieldStyle, fontFamily: "monospace", fontSize: "0.875rem" }}
                        onFocus={focus} onBlur={blur} />
                    <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
                        URL: /posts/{form.slug || "…"}
                    </p>
                </div>

                {/* Category */}
                <div>
                    <label style={labelStyle}>Category *</label>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                        <select value={categorySelect}
                            onChange={(e) => setCategorySelect(e.target.value)}
                            style={{ ...fieldStyle, flex: "1 1 180px", cursor: "pointer" }}
                            onFocus={focus} onBlur={blur}>
                            {PRIMARY_CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>

                        {categorySelect === "__custom__" && (
                            <input
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="e.g. Anime, Manga, Podcast…"
                                style={{ ...fieldStyle, flex: "2 1 220px" }}
                                onFocus={focus} onBlur={blur}
                            />
                        )}
                    </div>
                    {categorySelect === "__custom__" && (
                        <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
                            This will appear as a custom category badge on the post.
                        </p>
                    )}
                </div>

                {/* Cover Image */}
                <div>
                    <label style={labelStyle}>Cover Image</label>

                    {/* Tab switcher */}
                    <div style={{
                        display: "inline-flex",
                        padding: "0.25rem",
                        backgroundColor: "var(--color-surface-2)",
                        borderRadius: "var(--radius-pill)",
                        border: "1.5px solid var(--color-border)",
                        marginBottom: "0.75rem",
                        gap: "0.1rem",
                    }}>
                        <button type="button" style={tabBtn(imageTab === "url")} onClick={() => setImageTab("url")}>
                            <LinkIcon size={13} /> URL
                        </button>
                        <button type="button" style={tabBtn(imageTab === "upload")} onClick={() => setImageTab("upload")}>
                            <Upload size={13} /> Upload File
                        </button>
                    </div>

                    {/* URL input */}
                    {imageTab === "url" && (
                        <input value={form.cover_image}
                            onChange={(e) => set("cover_image", e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            style={fieldStyle} onFocus={focus} onBlur={blur} />
                    )}

                    {/* File upload */}
                    {imageTab === "upload" && (
                        <div>
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-border)"}`,
                                    borderRadius: "var(--radius-md)",
                                    backgroundColor: dragOver ? "var(--color-primary-container)" : "var(--color-surface-2)",
                                    padding: "1.5rem",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput}
                                    style={{ display: "none" }} />
                                {uploading ? (
                                    <p style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                                        Uploading…
                                    </p>
                                ) : (
                                    <>
                                        <ImageIcon size={28} style={{ margin: "0 auto 0.5rem", color: "var(--color-text-muted)", display: "block" }} />
                                        <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text)" }}>
                                            Drop image here or click to browse
                                        </p>
                                        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                                            JPEG, PNG, WebP, GIF · Max 8 MB
                                        </p>
                                    </>
                                )}
                            </div>
                            {uploadError && (
                                <p style={{ fontSize: "0.8rem", color: "#C0392B", marginTop: "0.4rem" }}>{uploadError}</p>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    {form.cover_image && (
                        <div style={{ marginTop: "0.75rem", position: "relative", display: "inline-block" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={form.cover_image} alt="Cover preview"
                                style={{ height: "100px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", objectFit: "cover", display: "block" }} />
                            <button type="button" onClick={() => set("cover_image", "")}
                                style={{
                                    position: "absolute", top: "-6px", right: "-6px",
                                    width: "20px", height: "20px", borderRadius: "50%",
                                    backgroundColor: "#C0392B", color: "#fff",
                                    border: "none", cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                }}>
                                <X size={10} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Score */}
                <div>
                    <label style={labelStyle}>Mochimeter Score: {form.score.toFixed(1)} / 10</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <input type="range" min={0} max={10} step={0.5} value={form.score}
                            onChange={(e) => set("score", parseFloat(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }} />
                        <div style={{ padding: "1rem 1.25rem", backgroundColor: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                            <Mochimeter score={form.score} size="md" />
                        </div>
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label style={labelStyle}>Excerpt (optional)</label>
                    <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)}
                        placeholder="A short summary shown on post cards…" rows={3}
                        style={{ ...fieldStyle, resize: "vertical" }} onFocus={focus} onBlur={blur} />
                </div>

                {/* Content */}
                <div>
                    <label style={labelStyle}>Content *</label>
                    <TiptapEditor content={form.content} onChange={(html) => set("content", html)} />
                </div>

                {/* Error */}
                {error && (
                    <p style={{ padding: "0.75rem 1rem", backgroundColor: "#FDECEA", borderRadius: "var(--radius-md)", color: "#C0392B", fontSize: "0.875rem", border: "1px solid #F5CFC8" }}>
                        {error}
                    </p>
                )}

                {/* Submit */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
                    <button type="button" onClick={(e) => handleSubmit(e, "published")}
                        className="btn-primary" disabled={loading}>
                        <Eye size={15} /> {loading ? "Saving…" : "Publish"}
                    </button>
                    <button type="button" onClick={(e) => handleSubmit(e, "draft")}
                        className="btn-secondary" disabled={loading}>
                        <Save size={15} /> Save as Draft
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn-secondary" disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}
