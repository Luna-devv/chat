import { Hono } from "hono";
import { join } from "path";
import { walkAllDirs } from "utils/routes/walk-all-dirs";

import { HttpErrorCode, HttpErrorMessage } from "~/constants/http-error";
import type { defineEndpoint } from "~/utils/define/endpoint";
import { getUrlFromFilename } from "~/utils/routes/filename-to-url";

const API_FILE_DIR = join(process.cwd(), "server", "api");
const apiFiles = walkAllDirs(API_FILE_DIR);

const app = new Hono();
export default app;

for (const filename of apiFiles) {
    const path = getUrlFromFilename(filename);
    const { default: file } = await import(filename /* @vite-ignore */) as { default: ReturnType<typeof defineEndpoint>; };

    app.all("/api" + path, (c) => {
        return file
            .func({ request: c.req.raw })
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