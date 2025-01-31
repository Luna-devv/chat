import { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { useCurrentRoomMessages, useLastMessageIdForRoom, useMessageStore } from "~/common/message";
import { useUserStore } from "~/common/user";
import { request } from "~/lib/api";
import type { APIPostRoomMessagesResponse } from "~/types/messages";

const MAX_MESSAGE_FETCH_LIMIT = 50 as const;

export function MessageView() {
    const messages = useCurrentRoomMessages();
    const users = useUserStore((store) => store.items);
    const addMessage = useMessageStore((store) => store.add);
    const addUser = useUserStore((store) => store.add);
    const lastMessageIds = useLastMessageIdForRoom();
    const scroll = useRef<HTMLDivElement>(null);
    const params = useParams();

    async function handleScroll() {
        if (!scroll.current || scroll.current.scrollTop !== 0) return;
        if (messages.find((message) => message.id === lastMessageIds[params.rid as `${number}`])) return;

        const prevScrollHeight = scroll.current.scrollHeight;
        let oldestMessageId = messages.sort((a, b) => a.id - b.id)[0]?.id;

        const search = new URLSearchParams({ limit: MAX_MESSAGE_FETCH_LIMIT.toString() });
        if (oldestMessageId) search.append("before", oldestMessageId.toString());

        const msgs = await request<APIPostRoomMessagesResponse>("get", `/rooms/${params.rid}/messages?${search.toString()}`);
        if (!Array.isArray(msgs)) return; // TODO: error?

        for (const message of msgs) {
            addUser(message.author);
            Object.assign(message, { author: undefined });
            addMessage(message);
        }

        oldestMessageId = messages.sort((a, b) => a.id - b.id)[0]?.id;
        if (msgs.length < MAX_MESSAGE_FETCH_LIMIT && oldestMessageId) lastMessageIds.setLastMessageId(Number(params.rid), oldestMessageId);

        const newScrollHeight = scroll.current.scrollHeight;
        scroll.current.scrollTop = newScrollHeight - prevScrollHeight;
    }

    useEffect(
        () => {
            if (!scroll.current) return;
            const controller = new AbortController();
            scroll.current.addEventListener("scroll", handleScroll, { signal: controller.signal });
            return () => controller.abort();
        },
        [messages, lastMessageIds, scroll, params]
    );

    useEffect(() => {
        if (messages.length) return;
        void handleScroll();
    }, [params]);

    return (
        <div className="w-full h-full p-4 overflow-y-scroll overflow-x-hidden" ref={scroll}>
            {messages.map((message) => <p key={message.id}>
                {users.find((user) => user.id === message.author_id)?.username}: {message.content}
            </p>)}
        </div>
    );
}