import type { EventMap } from "~/types/gateway";

export const events = {
    ready: () => {},
    user_update: () => {}
} satisfies EventMap;