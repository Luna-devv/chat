import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "~/lib/utils";
import { getServerIconUrl, getUserAvatarUrl } from "~/utils/url";

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden",
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center bg-border",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

function UserAvatar({
    id,
    username = "??",
    className
}: {
    id: number | null | undefined;
    username: string | null | undefined;
    className?: string;
}) {
    const src = id
        ? getUserAvatarUrl(id)
        : undefined;

    return (
        <Avatar className={cn("rounded-full", className)}>
            <AvatarImage src={src} />
            <AvatarFallback>{username!.slice(0, 2)}</AvatarFallback>
        </Avatar>
    );
}

function ServerIcon({
    id,
    name = "??",
    className
}: {
    id: number | null | undefined;
    name: string | null | undefined;
    className?: string;
}) {
    const src = id
        ? getServerIconUrl(id)
        : undefined;

    return (
        <Avatar className={cn("rounded-lg", className)}>
            <AvatarImage src={src} />
            <AvatarFallback>{name!.slice(0, 2)}</AvatarFallback>
        </Avatar>
    );
}

export { Avatar, AvatarFallback, AvatarImage, ServerIcon, UserAvatar };