import type { ColumnType, Generated, Selectable } from "kysely";
import { z } from "zod";

export interface ServerTable {
    id: Generated<number>;

    name: string;

    flags: Generated<number>;
    owner_id: number;

    icon_id: number | null;
    banner_id: number | null;

    created_at: ColumnType<string, string | undefined, never>;
}

export type Server = Selectable<ServerTable>;

// POST /servers
export const APIPostServersBodySchema = z.object({
    name: z.string().min(1).max(64),
    captcha_key: z.string()
});

export type APIPostServersBody = z.infer<typeof APIPostServersBodySchema>;
export type APIPostServersResponse = Server;