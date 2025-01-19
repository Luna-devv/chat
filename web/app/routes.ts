import {
    route,
    type RouteConfig
} from "@react-router/dev/routes";

export default [
    route("login", "./login/route.tsx")
] satisfies RouteConfig;