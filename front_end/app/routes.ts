import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from "@react-router/dev/routes";

export default [
    route("", "src/pages/user/User.tsx",),
    route("login", "src/pages/login/Login.tsx"),
    // ...prefix("concerts", [
        // index("src/pages/user/User.tsx"),
    //     layout("src/layout/Main.tsx", [
    //         index("src/pages/user/User.tsx",),
    //         route("/login", "src/pages/login/Login.tsx"),
    //       ]),
    //   ]),
    // layout("src/layout/Main.tsx", [
    //     route("hello", "src/pages/user/User.tsx",),
    // ]),
    

] satisfies RouteConfig;
