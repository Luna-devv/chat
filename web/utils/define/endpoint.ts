import type { Context } from "hono";

type Endpoint = "server" | "room" | undefined;

interface FuncProps<EndpointType extends Endpoint, RequireAuth extends boolean> {
    request: Request;
    serverId: EndpointType extends "server"
        ? number
        : null;
    roomId: EndpointType extends "room"
        ? number
        : null;
    userId: RequireAuth extends true
        ? number
        : null;

    c: Context;
}

interface OptionProps<EndpointType extends Endpoint, RequireAuth extends boolean> {
    route_type: EndpointType;
    require_auth: RequireAuth;
    require_server_permissions: RequireAuth extends true
        ? Partial<{
            server_owner: boolean;
        }>
        : never;
}

export function defineEndpoint<EndpointType extends Endpoint, RequireAuth extends boolean>(
    func: (props: FuncProps<EndpointType, RequireAuth>) => Promise<Response | undefined>,
    options?: Partial<OptionProps<EndpointType, RequireAuth>>
) {
    return {
        func,
        options
    };
}

export function defineEndpointOptions<EndpointType extends Endpoint, RequireAuth extends boolean>(
    options: Partial<OptionProps<EndpointType, RequireAuth>>
) {
    return options;
}