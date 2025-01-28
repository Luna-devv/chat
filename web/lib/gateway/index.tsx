import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { GatewayMessage } from "~/types/gateway";

import { events } from "./events";

enum State {
    Connecting = 0,
    Connected = 1
}

const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({
    children,
    fallback,
    url
}: {
    children: React.ReactNode;
    fallback: React.ReactNode;
    url: string;
}) {
    const [state, setState] = useState<State>(State.Connecting);
    const ws = useMemo(() => {
        const w = new WebSocket(url);

        w.onopen = () => setState(State.Connected);
        w.onclose = () => setState(State.Connecting);

        w.onmessage = (event) => {
            const parsedData = JSON.parse(event.data) as GatewayMessage;
            if (!parsedData?.t || !events[parsedData.t]) return;

            events[parsedData.t](parsedData.d as never);
        };

        return w;
    }, [url, events]);

    useEffect(
        () => () => ws.close(),
        [ws, url]
    );

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
            {state === State.Connecting && fallback}
        </WebSocketContext.Provider>
    );
}