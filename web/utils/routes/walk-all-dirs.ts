import { readdirSync, statSync } from "node:fs";
import path from "node:path";

export function walkAllDirs(dir: string): string[] {
    const results: string[] = [];

    for (const dirItem of readdirSync(dir)) {
        const fstat = statSync(path.join(dir, dirItem));
        if (fstat.isFile()) results.push(path.join(dir, dirItem));
        if (fstat.isDirectory()) walkAllDirs(path.join(dir, dirItem)).forEach((walkItem) => results.push(walkItem));
    }

    return results;
}