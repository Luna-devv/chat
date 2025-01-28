import { useCurrentUserStore } from "~/common/users";
import type { EventMap } from "~/types/gateway";

export const events = {
    ready: (data) => {
        useCurrentUserStore.setState(data.user);
    },
    user_update: (_data) => {}
} satisfies EventMap;