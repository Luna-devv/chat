import type { ApiError, HttpMethod, RouteLike } from "types";

export async function request<T>(
    method: HttpMethod,
    route: RouteLike,
    body?: Record<string, unknown> | FormData
): Promise<T | ApiError> {
    const isFormData = body && "append" in body && typeof body.append === "function";

    console.log(`${method} /api${route}`);
    const response = await fetch("/api" + route, {
        method,
        body: body
            ? (isFormData ? body as FormData : JSON.stringify(body))
            : undefined
    })
        .then((r) => r.headers.get("content-type") === "application/json" ? r.json() : undefined)
        .catch(() => ({ code: 0, message: "unknown error" }));

    return response;
}