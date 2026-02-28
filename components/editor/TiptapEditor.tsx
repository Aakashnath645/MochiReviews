"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon,
    List, ListOrdered, Quote, Minus, Undo, Redo,
    AlignLeft, AlignCenter,
} from "lucide-react";

type Props = {
    content: string;
    onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: "Start writing your review here…" }),
        ],
        content,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: { class: "tiptap-editor" },
        },
        immediatelyRender: false,
    });

    if (!editor) return null;

    const ToolbarButton = ({
        onClick,
        active,
        title,
        children,
    }: {
        onClick: () => void;
        active?: boolean;
        title: string;
        children: React.ReactNode;
    }) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                backgroundColor: active ? "var(--color-primary-container)" : "transparent",
                color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                transition: "background-color 0.15s, color 0.15s",
                fontFamily: "var(--font-body)",
                fontWeight: active ? 700 : 400,
            }}
        >
            {children}
        </button>
    );

    const Divider = () => (
        <div style={{ width: 1, height: 20, backgroundColor: "var(--color-border)", flexShrink: 0 }} />
    );

    const setLink = () => {
        const url = window.prompt("Link URL:", editor.getAttributes("link").href || "https://");
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().unsetLink().run();
            return;
        }
        editor.chain().focus().setLink({ href: url }).run();
    };

    return (
        <div>
            {/* Toolbar */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.15rem",
                flexWrap: "wrap",
                padding: "0.5rem 0.75rem",
                backgroundColor: "var(--color-surface-2)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
            }}>
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarButton>
                <Divider />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
                <Divider />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                    <span style={{ fontSize: "11px", fontWeight: 700 }}>H2</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
                    <span style={{ fontSize: "11px", fontWeight: 700 }}>H3</span>
                </ToolbarButton>
                <Divider />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={14} /></ToolbarButton>
                <Divider />
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center"><AlignCenter size={14} /></ToolbarButton>
                <Divider />
                <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon size={14} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule"><Minus size={14} /></ToolbarButton>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
