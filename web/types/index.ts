import type { HttpErrorEntry } from "~/constants/http-error";

export type HttpMethod = "get" | "post" | "patch" | "put" | "delete";
export type RouteLike = `/${string}`;

export type Awaitable<T> = Promise<T> | T;

export interface ApiError {
    code: HttpErrorEntry;
    message: string;
}