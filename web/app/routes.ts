import {
    layout,
    route,
    type RouteConfig
} from "@react-router/dev/routes";

export default [
    route("login", "./login/route.tsx"),
    route("verify-email", "./verify-email/route.tsx"),

    layout("./(app)/layout.tsx", [
        layout("./(app)/rooms/layout.tsx", [
            route("rooms/:sid", "./(app)/rooms/[sid]/route.tsx"),
            route("rooms/:sid/:rid", "./(app)/rooms/[sid]/[rid]/route.tsx"),
            route("rooms/*", "./(app)/not-found.tsx")
        ])
    ])
] satisfies RouteConfig;