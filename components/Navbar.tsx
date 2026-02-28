"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";

const categories = [
    { slug: "game", label: "Games", emoji: "🎮" },
    { slug: "book", label: "Books", emoji: "📚" },
    { slug: "tv", label: "TV", emoji: "📺" },
    { slug: "movie", label: "Movies", emoji: "🎬" },
    { slug: "music", label: "Music", emoji: "🎵" },
];

export default function Navbar() {
    const { theme, toggle } = useTheme();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "color-mix(in srgb, var(--color-surface) 85%, transparent)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                transition: "background-color 0.3s ease",
            }}
        >
            <div className="container-main" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem" }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0, textDecoration: "none" }}>
                    <span style={{ fontSize: "1.5rem" }}>🍡</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>
                        MochiReviews
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto", flexWrap: "nowrap" }}
                    className="hidden-mobile">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.4rem 0.9rem",
                                borderRadius: "var(--radius-pill)",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                transition: "background-color 0.2s ease, color 0.2s ease",
                                color: isActive(`/category/${cat.slug}`) ? "var(--color-on-primary)" : "var(--color-text-muted)",
                                backgroundColor: isActive(`/category/${cat.slug}`) ? "var(--color-primary)" : "transparent",
                            }}
                        >
                            {cat.emoji} {cat.label}
                        </Link>
                    ))}
                </nav>

                {/* Right controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "0.75rem" }}
                    className="hidden-mobile">
                    <Link href="/about" style={{
                        padding: "0.4rem 0.9rem",
                        borderRadius: "var(--radius-pill)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: isActive("/about") ? "var(--color-on-primary)" : "var(--color-text-muted)",
                        backgroundColor: isActive("/about") ? "var(--color-primary)" : "transparent",
                    }}>About</Link>

                    <button
                        onClick={toggle}
                        aria-label="Toggle theme"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.25rem",
                            height: "2.25rem",
                            borderRadius: "var(--radius-pill)",
                            border: "1.5px solid var(--color-border)",
                            background: "var(--color-surface-2)",
                            cursor: "pointer",
                            color: "var(--color-text)",
                            transition: "background-color 0.2s, border-color 0.2s",
                        }}
                    >
                        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="show-mobile"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "var(--radius-pill)",
                        border: "1.5px solid var(--color-border)",
                        background: "var(--color-surface-2)",
                        cursor: "pointer",
                        color: "var(--color-text)",
                    }}
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Mobile menu drawer */}
            {menuOpen && (
                <div style={{
                    borderTop: "1px solid var(--color-border)",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    backgroundColor: "var(--color-surface)",
                }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                padding: "0.6rem 1rem",
                                borderRadius: "var(--radius-md)",
                                fontWeight: 600,
                                color: isActive(`/category/${cat.slug}`) ? "var(--color-primary)" : "var(--color-text-muted)",
                                backgroundColor: isActive(`/category/${cat.slug}`) ? "var(--color-primary-container)" : "transparent",
                            }}
                        >
                            {cat.emoji} {cat.label}
                        </Link>
                    ))}
                    <Link href="/about" onClick={() => setMenuOpen(false)} style={{
                        padding: "0.6rem 1rem", borderRadius: "var(--radius-md)", fontWeight: 600, color: "var(--color-text-muted)"
                    }}>About</Link>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                            {theme === "light" ? "Light Mode" : "Dark Mode"}
                        </span>
                        <button onClick={toggle} style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.4rem 0.9rem", borderRadius: "var(--radius-pill)",
                            border: "1.5px solid var(--color-border)", background: "var(--color-surface-2)",
                            cursor: "pointer", color: "var(--color-text)", fontFamily: "var(--font-body)",
                            fontWeight: 600, fontSize: "0.85rem",
                        }}>
                            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                            {theme === "light" ? "Dark" : "Light"}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
