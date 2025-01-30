import type { RoomTable } from "~/types/rooms";
import type { ServerTable } from "~/types/server";
import type { UserTable } from "~/types/users";

export interface Database {
    users: UserTable;
    servers: ServerTable;
    rooms: RoomTable;
}