import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/utils";

type Props = {
    category: string;
    className?: string;
};

export default function CategoryBadge({ category, className }: Props) {
    const label = CATEGORY_LABELS[category] || category;
    const emoji = CATEGORY_EMOJIS[category] || "📝";
    // Use the specific badge class if it exists, otherwise fall back to a neutral one
    const badgeClass = CATEGORY_LABELS[category] ? `badge-${category}` : "badge-custom";

    return (
        <span className={`badge ${badgeClass} ${className || ""}`}>
            {emoji} {label}
        </span>
    );
}
