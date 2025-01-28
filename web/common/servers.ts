import { create } from "zustand";

import type { Server } from "~/types/server";

interface Props {
    servers: Server[];

    set: (servers: Server[]) => void;
    add: (server: Server) => void;
    remove: (serverId: number) => void;
}

export const useServerStore = create<Props>((set) => ({
    servers: [],

    set: (servers: Server[]) => {
        set(() => ({
            servers
        }));
    },
    add: (server: Server) => {
        set((state) => ({
            servers: [
                ...state.servers.filter((s) => s.id !== server.id),
                server
            ]
        }));
    },
    remove: (serverId: number) => {
        set((state) =>({
            servers: state.servers.filter((s) => s.id !== serverId)
        }));
    }
}));