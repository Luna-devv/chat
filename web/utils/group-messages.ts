import type { Message } from "~/types/messages";

export interface GroupedMessages {
    id: number;
    messages: Message[];
}

export function groupMessages(messages: Message[]): GroupedMessages[] {
    if (messages.length === 0) return [];

    return messages
        .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))
        .reduce<GroupedMessages[]>(
            (acc, message) => {
                const lastGroup = acc[acc.length - 1];

                if (!lastGroup || lastGroup.messages[0].author_id !== message.author_id) {
                    acc.push({ id: message.id, messages: [message] });
                    return acc;
                }

                const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];

                if (
                    (new Date(message.created_at).getTime() - new Date(lastMessage.created_at).getTime()) / 1_000 > 60 * 5
                ) {
                    acc.push({ id: message.id, messages: [message] });
                    return acc;
                }

                lastGroup.messages.push(message);
                return acc;
            },
            []
        )
        .sort((a, b) => +new Date(a.messages[0].created_at) - +new Date(b.messages[0].created_at));
}