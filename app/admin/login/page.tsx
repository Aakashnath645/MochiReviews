"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                setError("Incorrect password. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-accent-container) 100%)",
        }}>
            <div className="card" style={{ width: "100%", maxWidth: "380px", padding: "2.5rem 2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🍡</div>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.25rem" }}>
                        Admin Access
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        MochiReviews Dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}>
                                <Lock size={15} />
                            </div>
                            <input
                                type={show ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.7rem 2.75rem 0.7rem 2.5rem",
                                    borderRadius: "var(--radius-md)",
                                    border: error ? "1.5px solid #C0392B" : "1.5px solid var(--color-border)",
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-text)",
                                    fontSize: "0.95rem",
                                    fontFamily: "var(--font-body)",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                                onBlur={(e) => { e.target.style.borderColor = error ? "#C0392B" : "var(--color-border)"; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => !s)}
                                style={{
                                    position: "absolute",
                                    right: "0.875rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--color-text-muted)",
                                    padding: 0,
                                    display: "flex",
                                }}
                            >
                                {show ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p style={{ fontSize: "0.8rem", color: "#C0392B", padding: "0.6rem 0.875rem", backgroundColor: "#FDECEA", borderRadius: "var(--radius-sm)", border: "1px solid #F5CFC8" }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center", marginTop: "0.25rem" }}>
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
