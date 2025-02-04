import Redis from "ioredis";

import type { EventMap, GatewayMessage } from "~/types/gateway";

export const redis = new Redis();

export function emitGatewayEvent<T extends keyof EventMap>(
    channel: `user:${number}` | `server:${number}`,
    event: T,
    data: Parameters<EventMap[T]>[0]
) {
    void redis.publish(
        channel,
        JSON.stringify({
            t: event,
            d: data
        } satisfies GatewayMessage)
    );
}