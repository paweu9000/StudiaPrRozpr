import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login","routes/login/page.tsx"),
    route("/register","routes/register/page.tsx"),
    route("/items", "routes/items/page.tsx"),
    route("/logs", "routes/logs/page.tsx")
] satisfies RouteConfig;
