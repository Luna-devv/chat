import { useMessageStore } from "~/common/message";
import { useRoomStore } from "~/common/rooms";
import { useServerStore } from "~/common/servers";
import { useCurrentUserStore } from "~/common/users";
import type { EventMap } from "~/types/gateway";

export const events = {
    ready: (data) => {
        useCurrentUserStore.setState(data.user);

        const { set: setServers } = useServerStore.getState();
        setServers(data.servers || []);

        const { set: setRooms } = useRoomStore.getState();
        setRooms(data.rooms || []);
    },

    server_create: (server) => {
        const { add } = useServerStore.getState();
        add(server);
    },
    server_delete: (serverId) => {
        const { remove } = useServerStore.getState();
        remove(serverId);
    },

    room_create: (room) => {
        const { add } = useRoomStore.getState();
        add(room);
    },
    room_delete: (roomId) => {
        const { remove } = useRoomStore.getState();
        remove(roomId);
    },

    message_create: (message) => {
        const { add } = useMessageStore.getState();
        add(message);
    },
    message_delete: (messageId) => {
        const { remove } = useMessageStore.getState();
        remove(messageId);
    }
} satisfies EventMap;