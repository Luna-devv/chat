import { Hono } from "hono";
import { join } from "path";

import { HttpErrorCode, HttpErrorMessage } from "~/constants/http-error";
import { getServerOwnerId } from "~/db/utils/servers";
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
        if (file.options?.require_server_permissions && !path.includes("/:serverId")) {
            console.log(new Error("Cannot use server permission constrains on non-server routes: " + path));
        }

        const serverId = Number(c.req.param("serverId") || "0");
        const userId = file.options?.require_auth
            ? await auth(via(c.req.raw))
            : null;

        if (file.options?.require_auth && !userId) httpError(HttpErrorMessage.InvalidAuthorization);

        if (file.options?.require_server_permissions?.server_owner) {
            const ownerId = await getServerOwnerId(serverId);
            if (userId !== ownerId) httpError(HttpErrorMessage.MissingAccess);
        }

        return file
            .func({
                request: c.req.raw,
                serverId,
                userId
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