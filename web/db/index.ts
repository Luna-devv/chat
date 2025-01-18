import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import type { Database } from "./types";

const dialect = new PostgresDialect({
    pool: new pg.Pool({
        database: "chat",
        host: "localhost",
        user: "prod",
        password: "plschangeme",
        port: 5_432,
        max: 10
    })
});

export const db = new Kysely<Database>({
    dialect
});