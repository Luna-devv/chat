import type { Server } from "./server";
import type { CurrentUser } from "./users";

import type { Awaitable } from ".";

export interface EventMap {
    ready: (data: ReadyEvent) => Awaitable<void>;
    server_create: (server: ServerCreateEvent) => Awaitable<void>;
    server_delete: (serverId: number) => Awaitable<void>;
}

export interface GatewayMessage<T extends keyof EventMap = keyof EventMap> {
    t: T;
    d: Parameters<EventMap[T]>[0];
}

export interface ReadyEvent {
    user: CurrentUser;
    servers: Server[];
}

export type ServerCreateEvent = Server;