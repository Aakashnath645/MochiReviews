import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{ paddingTop: "4rem", paddingBottom: "5rem", textAlign: "center" }}>
            <div className="container-main">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍡</div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.75rem" }}>
                    404 — Page Not Found
                </h1>
                <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    The mochi you&apos;re looking for has vanished into thin air.
                </p>
                <Link href="/" className="btn-primary">
                    Back to Reviews
                </Link>
            </div>
        </div>
    );
}
