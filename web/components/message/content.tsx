export function MessageContent({ content }: { content: string | null; }) {
    return (
        <div className="opacity-90 break-words text-sm">
            {content}
        </div>
    );
}