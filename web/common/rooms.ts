import type { Room } from "~/types/rooms";
import { defineDataStore } from "~/utils/define/data-store";

export const useRoomStore = defineDataStore<Room>();