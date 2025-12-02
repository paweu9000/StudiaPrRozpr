import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login","routes/login/page.tsx"),
    route("/register","routes/register/page.tsx")
] satisfies RouteConfig;
