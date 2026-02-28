type Props = {
    html: string;
};

export default function RichTextRenderer({ html }: Props) {
    return (
        <div
            className="prose-mochi"
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ fontSize: "1.05rem", lineHeight: 1.8 }}
        />
    );
}
