import {
    layout,
    route,
    type RouteConfig
} from "@react-router/dev/routes";

export default [
    route("login", "./login/route.tsx"),
    route("verify-email", "./verify-email/route.tsx"),

    layout("./(app)/layout.tsx", [
        layout("./(app)/rooms/[id]/layout.tsx", [
            route("rooms/:id", "./(app)/rooms/[id]/route.tsx")
        ])
    ])
] satisfies RouteConfig;