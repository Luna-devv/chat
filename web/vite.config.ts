import { vitePlugin as remix } from "@remix-run/dev";
import { glob, stat } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
    interface Future {
        v3_singleFetch: true;
    }
}

export default defineConfig({
    plugins: [
        remix({

            future: {
                v3_fetcherPersist: true,
                v3_relativeSplatPath: true,
                v3_throwAbortReason: true,
                v3_singleFetch: true,
                v3_lazyRouteDiscovery: true
            },

            ignoredRouteFiles: ["**/.*"],
            routes: async (defineRoutes) => {
                const rootish = join(process.cwd(), "app");
                const files = glob(rootish + "/**");

                const paths: string[] = [];

                for await (const file of files) {
                    const stats = await stat(file);

                    if (
                        !stats.isFile()
                        || !/\.tsx?$/.test(file)
                        || file.includes("root")
                        || file.includes("not-found")
                    ) continue;

                    const path = file.split(rootish)[1];
                    paths.push(path);
                }

                return defineRoutes((route) => {
                    for (const path of paths) {

                        route(path.replace(/(route)?\.tsx?$/i, "").replace(/\/$/, ""), path.slice(1));
                    }

                    route("/api/*", "api/not-found.ts");
                });
            }

        }),
        tsconfigPaths()
    ]
});