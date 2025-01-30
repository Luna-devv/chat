import { useMemo } from "react";
import { useParams } from "react-router";

import { useRoomStore } from "~/common/rooms";
import type { Server } from "~/types/server";
import { defineDataStore } from "~/utils/define/data-store";

export const useServerStore = defineDataStore<Server>();

export function useCurrentServer() {
    const servers = useServerStore((store) => store.items);
    const params = useParams();

    return useMemo(
        () => servers.find((s) => s.id === Number(params.sid)),
        [servers, params]
    );
}

export function useCurrentServerRooms() {
    const rooms = useRoomStore((store) => store.items);
    const params = useParams();

    return useMemo(
        () => rooms.filter((r) => r.server_id === Number(params.sid)),
        [rooms, params]
    );
}