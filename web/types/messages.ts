import type { ColumnType, Generated, Selectable } from "kysely";
import { z } from "zod";

import type { PublicUser } from "./users";

export interface MessageTable {
    id: Generated<number>;

    content: string | null;

    type: MessageType;
    flags: Generated<number>; // currently unused

    room_id: number;
    author_id: number;
    attachment_ids: Generated<number[]>; // currently unused

    edited_at: ColumnType<string, string | undefined, never> | null;
    created_at: ColumnType<string, string | undefined, never>;
}

export enum MessageType {
    Default = 0
}

export type Message = Selectable<MessageTable> & {
    author: PublicUser;
};

// POST /rooms/1/messages
export const APIPostRoomMessagesBodySchema = z.object({
    content: z.string().max(1_024) // .optional(),
});

export type APIPostRoomMessagesBody = z.infer<typeof APIPostRoomMessagesBodySchema>;
export type APIPostRoomMessagesResponse = Message;

// GET /rooms/1/messages
export const APIGetRoomMessagesQuerySchema = z.object({
    limit: z.string().regex(/^(([1-9][0-9]?)|100)$/).default("50").transform((str) => Number(str)),
    before: z.string().regex(/^\d*$/).default("999999999").transform((str) => Number(str))
});

export type APIGetRoomMessagesQuery = z.infer<typeof APIGetRoomMessagesQuerySchema>;
export type APIGetRoomMessagesResponse = Message[];