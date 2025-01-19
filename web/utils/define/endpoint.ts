import type { Awaitable } from "~/types";

interface FuncProps {
    request: Request;
}

export function defineEndpoint(
    func: (props: FuncProps) => Awaitable<Response>
) {
    return {
        func
    };
}