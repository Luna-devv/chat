import { createContext, useContext, useEffect, useMemo } from "react";

import type { GatewayMessage } from "~/types/gateway";

import { events } from "./events";

const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({
    children,
    url
}: {
    children: React.ReactNode;
    url: string;
}) {
    const ws = useMemo(() => new WebSocket(url), [url]);

    useEffect(() => {
        ws.onopen = () => console.log("WebSocket connected");
        ws.onclose = () => console.log("WebSocket disconnected");

        ws.onmessage = (event) => {
            const parsedData = JSON.parse(event.data) as GatewayMessage;
            if (!parsedData?.t || !events[parsedData.t]) return;

            events[parsedData.t](parsedData.d as never);
        };

        return () => ws.close();
    }, [url]);

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
}