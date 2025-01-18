import {
    prefix,
    route,
    type RouteConfig
} from "@react-router/dev/routes";
import { join } from "path";
import { getUrlFromFilename } from "utils/routes/filename-to-url";
import { walkAllDirs } from "utils/routes/walk-all-dirs";

const API_FILE_DIR = join(process.cwd(), "app", "api");
const apiFiles = walkAllDirs(API_FILE_DIR);

export default [
    ...prefix("api", [
        ...apiFiles.map((filename) => getApiMapping(filename)),
        route("*", "./api/not-found.ts")
    ]),

    route("login", "./login/route.tsx")
] satisfies RouteConfig;

function getApiMapping(filename: string) {
    const path = getUrlFromFilename(filename);
    console.log(filename, path);
    return route(path, filename);
}