import { useQuery } from "react-query";
import type { RouteLike } from "types";

import { request } from ".";

export const cacheOptions = {
    enabled: true,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false
};

export function useApiGet<T>(route: RouteLike) {
    const { data, isLoading, error } = useQuery(
        route,
        () => request("get", route),
        cacheOptions
    );

    if (data && typeof data === "object" && "message" in data) {
        return { data: undefined, isLoading, error: data.message };
    }

    return {
        data,
        isLoading,
        error
    };
}