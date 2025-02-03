import type { ColumnType, Selectable } from "kysely";

export interface ServerMemberTable {
    server_id: number;
    user_id: number;

    joined_at: ColumnType<string, string | undefined, never>;
}

export type ServerMember = Selectable<ServerMemberTable>;