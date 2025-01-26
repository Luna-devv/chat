import type { EventMap } from "~/types/gateway";

export const events = {
    ready: (_data) => {},
    user_update: (_data) => {}
} satisfies EventMap;