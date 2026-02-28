import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Admin top bar */}
            <div style={{
                backgroundColor: "var(--color-surface)",
                borderBottom: "1px solid var(--color-border)",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
            }}>
                <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, color: "var(--color-primary)", fontSize: "0.95rem" }}>
                    🍡 Admin Dashboard
                </Link>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", padding: "0.2rem 0.6rem", backgroundColor: "var(--color-primary-container)", borderRadius: "var(--radius-pill)" }}>
                    MochiReviews
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Link href="/" className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.875rem" }}>
                        ← View Blog
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            <div style={{ flex: 1, padding: "2rem 1.25rem" }}>
                <div className="container-main">
                    {children}
                </div>
            </div>
        </div>
    );
}

function LogoutButton() {
    // Client component extracted inline is a pattern to avoid — use a separate file
    // Using a simple form action instead:
    return (
        <form action="/api/auth/logout" method="POST">
            <button type="submit" className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.875rem", cursor: "pointer" }}>
                Sign Out
            </button>
        </form>
    );
}
