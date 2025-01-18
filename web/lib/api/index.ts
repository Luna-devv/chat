import type { ApiError, HttpMethod, RouteLike } from "types";

export async function request<T>(
    method: HttpMethod,
    route: RouteLike,
    body?: Record<string, unknown> | FormData
): Promise<T | ApiError> {
    const isFormData = body && "append" in body && typeof body.append === "function";

    const response = await fetch("/api" + route, {
        method,
        body: body
            ? (isFormData ? body as FormData : JSON.stringify(body))
            : undefined
    })
        .then((r) => r.json())
        .catch(() => null);

    return response || { code: 0, message: "unknown error" };
}