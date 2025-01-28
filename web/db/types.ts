import type { UserTable } from "types/users";

import type { ServerTable } from "~/types/server";

export interface Database {
    users: UserTable;
    servers: ServerTable;
}