import { Hono } from "hono";
import { join } from "path";
import { walkAllDirs } from "utils/routes/walk-all-dirs";

import { HttpErrorCode } from "~/constants/http-error";
import type { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";
import { getUrlFromFilename } from "~/utils/routes/filename-to-url";

const API_FILE_DIR = join(process.cwd(), "server", "api");
const apiFiles = walkAllDirs(API_FILE_DIR);

const app = new Hono();
export default app;

for (const filename of apiFiles) {
    const path = getUrlFromFilename(filename);
    const { default: file } = await import(filename) as { default: ReturnType<typeof defineEndpoint>; };
    console.log(file);

    console.log(path);
    app.all("/api" + path, (c) => file.func({ request: c.req.raw }));
}

app.all("/api/*", () => {
    return httpError(HttpErrorCode.NotFound);
});