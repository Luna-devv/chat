import type { CurrentUser, PublicUser } from "./users";

import type { Awaitable } from ".";

export interface EventMap {
    ready: (data: ReadyEvent) => Awaitable<void>;
    user_update: (data: UserUpdateEvent) => Awaitable<void>;
}

export interface GatewayMessage<T extends keyof EventMap = keyof EventMap> {
    t: T;
    d: Parameters<EventMap[T]>[0];
}

export interface ReadyEvent {
    user: CurrentUser;
}

export type UserUpdateEvent = Partial<PublicUser >;