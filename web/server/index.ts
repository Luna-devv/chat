import type { Context } from "hono";
import { Hono } from "hono";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { join } from "path";

import { HttpErrorCode, HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { auth, via } from "~/utils/auth";
import type { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";
import { getPathFromFilename } from "~/utils/routes/filename-to-path";
import { walkAllDirs } from "~/utils/routes/walk-all-dirs";

interface RouteFile {
    default: ReturnType<typeof defineEndpoint>;
}

const API_FILE_DIR = join(process.cwd(), "server", "api");
const apiFiles = walkAllDirs(API_FILE_DIR);

const app = new Hono();
export default app;

for (const filename of apiFiles) {
    const path = getPathFromFilename(filename);
    const { default: file } = await import(filename /* @vite-ignore */) as RouteFile;

    app.all("/api" + path, async (c) => {
        const ctx = await getContext(c, file);
        if (typeof ctx === "string") {
            return Response.json(
                {
                    code: HttpErrorCode.NotFound,
                    message: HttpErrorMessage.NotFound
                },
                {
                    status: HttpErrorCode.NotFound
                }
            );
        }

        return file
            .func({
                request: c.req.raw,
                c,

                userId: ctx.userId,

                server: ctx.server,
                member: ctx.member,
                room: ctx.room
            })
            .catch((e) => e);
    });
}

app.all("/api/*", () => {
    return Response.json(
        {
            code: HttpErrorCode.NotFound,
            message: HttpErrorMessage.NotFound
        },
        {
            status: HttpErrorCode.NotFound
        }
    );
});

async function getContext(c: Context, file: ReturnType<typeof defineEndpoint>) {
    const userId = file.options?.require_auth
        ? await auth(via(c.req.raw))
        : null;

    if (file.options?.require_auth && !userId) return HttpErrorMessage.InvalidAuthorization;

    const ctx = await getContextData(c, file, userId!);
    if (typeof ctx === "string") return ctx;

    return {
        userId,

        server: ctx.server,
        member: ctx.member,
        room: ctx.room
    };
}

function getContextData(c: Context, file: ReturnType<typeof defineEndpoint>, userId: number) {
    switch (file.options?.route_type) {
        case "server": return getContextForServer(c, file, userId);
        case "room": return getContextForRoom(c, file, userId);
        default: return { server: null, member: null, room: null };
    }
}

async function getContextForServer(c: Context, file: ReturnType<typeof defineEndpoint>, userId: number) {
    const serverId = Number(c.req.param("serverId")) | 0;

    const server = await db
        .selectFrom("servers")
        .selectAll()
        .where("id", "=", serverId)
        .select((eb) => [
            jsonObjectFrom(
                eb
                    .selectFrom("server_members")
                    .whereRef("servers.id", "=", "server_members.server_id")
                    .where("server_members.user_id", "=", userId)
                    .select("server_members.joined_at")
            )
                .as("member")
        ])
        .executeTakeFirst();

    if (!server) return HttpErrorMessage.UnknownServer;
    if (!server.member) return HttpErrorMessage.MissingAccess;

    if (file.options?.require_server_permissions?.server_owner) {
        if (userId !== server.owner_id) httpError(HttpErrorMessage.MissingAccess);
    }

    return {
        member: server.member,
        get server() {
            Object.assign(server, { member: undefined });
            return server;
        },
        room: null
    };
}

async function getContextForRoom(c: Context, file: ReturnType<typeof defineEndpoint>, userId: number) {
    const roomId = Number(c.req.param("roomId")) | 0;

    const room = await db
        .selectFrom("rooms")
        .selectAll()
        .where("id", "=", roomId)
        .select((eb) => [
            jsonObjectFrom(
                eb
                    .selectFrom("servers")
                    .whereRef("rooms.server_id", "=", "servers.id")
                    .selectAll()
            )
                .as("server"),
            jsonObjectFrom(
                eb
                    .selectFrom("server_members")
                    .whereRef("rooms.server_id", "=", "server_members.server_id")
                    .where("server_members.user_id", "=", userId)
                    .select("server_members.joined_at")
            )
                .as("member")
        ])
        .executeTakeFirst();

    if (!room) return HttpErrorMessage.UnknownRoom;
    if (!room.member) return HttpErrorMessage.MissingAccess;

    if (file.options?.require_server_permissions?.server_owner) {
        if (userId !== room.server!.owner_id) httpError(HttpErrorMessage.MissingAccess);
    }

    return {
        server: room.server,
        member: room.member,
        get room() {
            Object.assign(room, { server: undefined, member: undefined });
            return room;
        }
    };
}