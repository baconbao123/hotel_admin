import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/rootLayout.tsx", [
    index("./routes/dashboard/page.dashboard.tsx"),
   
    route("profile", "./routes/profile/page.profile.tsx"),
    route("setting", "./routes/settings/page.setting.tsx"),
  ]),
  layout("./layouts/authLayout.tsx", [
    route("login", "./routes/login/page.login.tsx"),
    route("register", "./routes/register/page.register.tsx"),
  ]),
] satisfies RouteConfig;
