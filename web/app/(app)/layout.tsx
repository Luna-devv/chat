import { Outlet } from "react-router";

import { Config } from "~/constants/config";
import { WebSocketProvider } from "~/lib/gateway";

export default function RoomLayout() {
    return (
        <WebSocketProvider url={Config.gateway_url}>
            <Outlet />
        </WebSocketProvider>
    );
}