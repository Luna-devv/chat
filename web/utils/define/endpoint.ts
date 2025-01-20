interface FuncProps {
    request: Request;
}

export function defineEndpoint(
    func: (props: FuncProps) => Promise<Response | undefined>
) {
    return {
        func
    };
}