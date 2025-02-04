import type { ServerMember } from "./members";
import type { Message } from "./messages";
import type { Room } from "./rooms";
import type { GatewayServer, Server } from "./server";
import type { CurrentUser } from "./users";

import type { Awaitable } from ".";

export interface EventMap {
    ready: (data: ReadyEvent) => Awaitable<void>;

    server_create: (server: ServerCreateEvent) => Awaitable<void>;
    server_delete: (serverId: ServerDeleteEvent) => Awaitable<void>;

    room_create: (server: RoomCreateEvent) => Awaitable<void>;
    room_delete: (serverId: RoomDeleteEvent) => Awaitable<void>;

    message_create: (message: MessageCreateEvent) => Awaitable<void>;
    message_delete: (messageId: MessageDeleteEvent) => Awaitable<void>;
}

export interface GatewayMessage<T extends keyof EventMap = keyof EventMap> {
    t: T;
    d: Parameters<EventMap[T]>[0];
}

export interface ReadyEvent {
    user: CurrentUser;
    current_user_members: ServerMember[];
    servers: Server[];
    rooms: Room[];
}

export type ServerCreateEvent = GatewayServer;
export type ServerDeleteEvent = number;

export type RoomCreateEvent = Room;
export type RoomDeleteEvent = number;

export type MessageCreateEvent = Message;
export type MessageDeleteEvent = number;