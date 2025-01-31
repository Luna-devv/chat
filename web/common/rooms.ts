import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Room } from "~/types/rooms";
import { defineDataStore } from "~/utils/define/data-store";

export const useRoomStore = defineDataStore<Room>();

interface Props {
    [x: `${number}`]: number;
    setLastRoom: (serverId: number, channelId: number) => void;
}

export const useLastRoomForServerStore = create<Props>()(
    persist(
        (set) => ({
            setLastRoom: (serverId, channelId) => set({ [`${serverId}`]: channelId })
        }),
        {
            name: "last-server-room-ids",
            storage: createJSONStorage(() => localStorage)
        }
    )
);