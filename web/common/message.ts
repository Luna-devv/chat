import { useMemo } from "react";
import { useParams } from "react-router";

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