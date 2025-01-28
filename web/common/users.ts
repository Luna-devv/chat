import { create } from "zustand";

import type { CurrentUser } from "~/types/users";

export const useCurrentUserStore = create<CurrentUser | null>(() => null);