import { Outlet } from "react-router";

import { RoomList } from "~/components/rooms/room-list";
import { ServerList } from "~/components/rooms/server-list";
import { CurrentUserPanel } from "~/components/rooms/user-panel";

export default function ServerLayout() {
    return (
        <div className="flex h-screen w-full max-h-screen overflow-hidden">
            <div className="flex relative">
                <ServerList />
                <RoomList />
                <CurrentUserPanel />
            </div>
            <Outlet />
        </div>
    );
}