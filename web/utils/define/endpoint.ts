import type { Context } from "hono";

import type { ServerMember } from "~/types/members";
import type { Room } from "~/types/rooms";
import type { Server } from "~/types/server";

type Endpoint = "server" | "room" | undefined;

interface FuncProps<EndpointType extends Endpoint, RequireAuth extends boolean> {
    request: Request;
    c: Context;

    userId: RequireAuth extends true
        ? number
        : null;

    server: EndpointType extends "server"
        ? Server
        : EndpointType extends "room"
            ? Server
            : null;
    member: EndpointType extends "server"
        ? Pick<ServerMember, "joined_at">
        : EndpointType extends "room"
            ? Pick<ServerMember, "joined_at">
            : null;
    room: EndpointType extends "room"
        ? Room
        : null;


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