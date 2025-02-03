import { ClipboardPenIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { request } from "~/lib/api";
import type { APIPostRoomInvitesResponse } from "~/types/invites";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function CreateInviteModal({
    children,
    className,
    roomId
}: {
    children: ReactNode;
    className?: string;
    roomId: number;
}) {
    const [open, setOpen] = useState(false);
    const [invite, setInvite] = useState<APIPostRoomInvitesResponse | null>(null);

    async function handle() {
        const res = await request<APIPostRoomInvitesResponse>("post", `/rooms/${roomId}/invites`);

        if ("message" in res) {
            return; // error?
        }

        setInvite(res);
    }

    useEffect(
        () => {
            if (!open) return;
            void handle();
        },
        [open]
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
        >
            <DialogTrigger className={className}>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create an Invite</DialogTitle>
                    <DialogDescription>This invite code can be shared to join this server.</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 items-end">
                    <Input
                        value={invite?.code}
                        readOnly
                    />
                    <Button
                        variant="secondary"
                        onClick={() => navigator.clipboard.writeText(invite?.code || "")}
                    >
                        <ClipboardPenIcon />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    );
}