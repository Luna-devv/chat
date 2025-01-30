import type { Server } from "~/types/server";
import { defineDataStore } from "~/utils/define/data-store";

export const useServerStore = defineDataStore<Server>();