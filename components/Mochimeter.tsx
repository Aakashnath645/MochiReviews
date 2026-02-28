"use client";

type Props = {
    score: number; // 0 to 10
    size?: "sm" | "md" | "lg";
};

const TOTAL = 10;

export default function Mochimeter({ score, size = "md" }: Props) {
    const blobSizes = { sm: 18, md: 26, lg: 36 };
    const blobSize = blobSizes[size];
    const gap = size === "sm" ? 3 : size === "md" ? 5 : 8;

    const blobs = Array.from({ length: TOTAL }, (_, i) => {
        const value = i + 1;
        if (score >= value) return "full";
        if (score >= value - 0.5) return "half";
        return "empty";
    });

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
                flexWrap: "wrap",
            }}
            role="img"
            aria-label={`Mochimeter score: ${score} out of 10`}
        >
            <div style={{ display: "flex", gap: `${gap}px`, flexWrap: "wrap" }}>
                {blobs.map((state, i) => (
                    <MochiBlob key={i} state={state} size={blobSize} index={i} />
                ))}
            </div>
            <span
                style={{
                    fontSize: size === "sm" ? "0.8rem" : size === "md" ? "0.95rem" : "1.15rem",
                    fontWeight: 800,
                    color: "var(--color-primary)",
                    padding: "0.2rem 0.65rem",
                    backgroundColor: "var(--color-primary-container)",
                    borderRadius: "var(--radius-pill)",
                    letterSpacing: "-0.01em",
                    minWidth: "fit-content",
                }}
            >
                {score % 1 === 0 ? score.toFixed(1) : score} / 10
            </span>
        </div>
    );
}

function MochiBlob({
    state,
    size,
    index,
}: {
    state: "full" | "half" | "empty";
    size: number;
    index: number;
}) {
    const uniqueId = `mochi-grad-${index}-${state}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            className="mochi-blob"
            style={{
                cursor: "pointer",
                transition: "transform 0.15s ease",
                flexShrink: 0,
            }}
        >
            <defs>
                {state === "half" && (
                    <linearGradient id={uniqueId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="50%" stopColor="var(--color-mochi-fill)" />
                        <stop offset="50%" stopColor="var(--color-mochi-empty)" />
                    </linearGradient>
                )}
            </defs>
            {/* Main mochi body */}
            <ellipse
                cx="16"
                cy="18"
                rx="13"
                ry="11"
                fill={
                    state === "full"
                        ? "var(--color-mochi-fill)"
                        : state === "half"
                            ? `url(#${uniqueId})`
                            : "var(--color-mochi-empty)"
                }
                style={{ transition: "fill 0.2s ease" }}
            />
            {/* Top knot/bump */}
            <ellipse
                cx="16"
                cy="9"
                rx="5"
                ry="4"
                fill={
                    state === "full"
                        ? "var(--color-mochi-fill)"
                        : state === "half"
                            ? "var(--color-mochi-half)"
                            : "var(--color-mochi-empty)"
                }
                style={{ transition: "fill 0.2s ease" }}
            />
            {/* Highlight shine */}
            {(state === "full" || state === "half") && (
                <ellipse
                    cx="12"
                    cy="14"
                    rx="3.5"
                    ry="2"
                    fill="rgba(255,255,255,0.32)"
                    transform="rotate(-20 12 14)"
                />
            )}
            {/* Face dots (full only) */}
            {state === "full" && (
                <>
                    <circle cx="13" cy="19" r="1.2" fill="rgba(100,40,20,0.35)" />
                    <circle cx="19" cy="19" r="1.2" fill="rgba(100,40,20,0.35)" />
                    <path
                        d="M13.5 22 Q16 24 18.5 22"
                        stroke="rgba(100,40,20,0.35)"
                        strokeWidth="1.2"
                        fill="none"
                        strokeLinecap="round"
                    />
                </>
            )}
        </svg>
    );
}
