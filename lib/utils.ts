export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export const CATEGORY_LABELS: Record<string, string> = {
    game: "Video Game",
    book: "Book",
    tv: "TV Show",
    movie: "Movie",
    music: "Music Album",
};

export const CATEGORY_EMOJIS: Record<string, string> = {
    game: "🎮",
    book: "📚",
    tv: "📺",
    movie: "🎬",
    music: "🎵",
};
