import { LoaderCircleIcon } from "lucide-react";
import { Outlet } from "react-router";

import { Config } from "~/constants/config";
import { WebSocketProvider } from "~/lib/gateway";

export default function RoomLayout() {
    return (
        <WebSocketProvider
            url={Config.gateway_url}
            fallback={
                <div className="flex items-center justify-center bg-background absolute h-screen w-screen top-0 left-0 z-100">
                    <LoaderCircleIcon className="animate-spin size-8 text-violet-400" strokeWidth={2.5} />
                </div>
            }
        >
            <Outlet />
        </WebSocketProvider>
    );
}