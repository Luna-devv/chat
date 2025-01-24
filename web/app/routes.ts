import {
    route,
    type RouteConfig
} from "@react-router/dev/routes";

export default [
    route("login", "./login/route.tsx"),
    route("verify-email", "./verify-email/route.tsx")
] satisfies RouteConfig;