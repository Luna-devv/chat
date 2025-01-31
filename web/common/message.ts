import { useMemo } from "react";
import { useParams } from "react-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Message } from "~/types/messages";
import { defineDataStore } from "~/utils/define/data-store";

export const useMessageStore = defineDataStore<Message>();

export function useCurrentRoomMessages() {
    const messages = useMessageStore((store) => store.items);
    const params = useParams();

    return useMemo(
        () => messages.filter((r) => r.room_id === Number(params.rid)),
        [messages, params]
    );
}

interface Props {
    [x: `${number}`]: number;
    setLastMessageId: (channelId: number, messageId: number) => void;
}

export const useLastMessageIdForRoomStore = create<Props>()(
    persist(
        (set) => ({
            setLastMessageId: (channelId, messageId) => set({ [`${channelId}`]: messageId })
        }),
        {
            name: "last-room-message-ids",
            storage: createJSONStorage(() => localStorage)
        }
    )
);