import type { InviteTable } from "~/types/invites";
import type { ServerMemberTable } from "~/types/members";
import type { MessageTable } from "~/types/messages";
import type { RoomTable } from "~/types/rooms";
import type { ServerTable } from "~/types/server";
import type { UserTable } from "~/types/users";

export interface Database {
    users: UserTable;
    servers: ServerTable;
    rooms: RoomTable;
    messages: MessageTable;
    invites: InviteTable;
    server_members: ServerMemberTable;
}