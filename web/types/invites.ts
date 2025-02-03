import type { ColumnType, Selectable } from "kysely";
import { z } from "zod";

import type { ServerMember } from "./members";

export interface InviteTable {
    code: string;

    server_id: number;
    room_id: number; // just to automatically open the room, not used for joining directly
    author_id: number;

    expires_at: ColumnType<string, string | undefined, never> | null; // not used yet
    created_at: ColumnType<string, string | undefined, never>;
}

export type PartialInvite = Selectable<InviteTable>;

// stored in redis
export interface InviteMetadata {
    uses: number;
}

export type Invite = PartialInvite & InviteMetadata;

// POST /rooms/1/invites
export const APIPostRoomInvitesBodySchema = z.object({});

export type APIPostRoomInvitesBody = z.infer<typeof APIPostRoomInvitesBodySchema>;
export type APIPostRoomInvitesResponse = PartialInvite;

// GET /rooms/1/invites/abcdefgh
// unused
export type APIGetInviteResponse = Invite;

// POST /rooms/1/invites/abcdefgh
export const APIPostInviteBodySchema = z.object({
    captcha_key: z.string()
});

export type APIPostInviteBody = z.infer<typeof APIPostInviteBodySchema>;
export type APIPostInviteResponse = ServerMember & {
    invite_room_id: number;
};