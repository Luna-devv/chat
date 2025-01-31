import type { PublicUser } from "~/types/users";
import { defineDataStore } from "~/utils/define/data-store";

export const useUserStore = defineDataStore<PublicUser>();