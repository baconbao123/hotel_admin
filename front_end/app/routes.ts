import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/rootLayout.tsx", [
    index("./pages/dashboard/page.dashboard.tsx"),
   
    route("profile", "./pages/profile/page.profile.tsx"),
    route("setting", "./pages/settings/page.setting.tsx"),
  ]),
  layout("./layouts/authLayout.tsx", [
    route("login", "./pages/login/page.login.tsx"),
    route("register", "./pages/register/page.register.tsx"),
  ]),
] satisfies RouteConfig;
