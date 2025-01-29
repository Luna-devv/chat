interface FuncProps<RequireAuth extends boolean> {
    request: Request;
    serverId: number;
    userId: RequireAuth extends true
        ? number
        : null;
}

interface OptionProps<RequireAuth extends boolean> {
    require_auth: RequireAuth;
    require_server_permissions: RequireAuth extends true
        ? Partial<{
            server_owner: boolean;
        }>
        : never;
}

export function defineEndpoint<RequireAuth extends boolean>(
    func: (props: FuncProps<RequireAuth>) => Promise<Response | undefined>,
    options?: Partial<OptionProps<RequireAuth>>
) {
    return {
        func,
        options
    };
}

export function defineEndpointOptions<RequireAuth extends boolean>(
    options: Partial<OptionProps<RequireAuth>>
) {
    return options;
}