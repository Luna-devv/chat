import { useServerStore } from "~/common/servers";
import { useCurrentUserStore } from "~/common/users";
import type { EventMap } from "~/types/gateway";

export const events = {
    ready: (data) => {
        useCurrentUserStore.setState(data.user);
        const { set } = useServerStore.getState();
        set(data.servers || []);
    },
    server_create: (server) => {
        const { add } = useServerStore.getState();
        add(server);
    },
    server_delete: (server) => {
        const { remove } = useServerStore.getState();
        remove(server);
    }
} satisfies EventMap;