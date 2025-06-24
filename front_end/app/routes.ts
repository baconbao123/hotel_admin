import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/rootLayout.tsx", [
    route("", "./routes/protectedRoute.tsx", [
      index("./pages/dashboard/DashboardPage.tsx"),
      route("profile", "./pages/profile/ProfilePage.tsx"),
      route("setting", "./pages/settings/SettingPage.tsx"),
      route("user", "./pages/user/UserList.tsx"),
      route("role", "./pages/role/RoleList.tsx"),
      route("bookings/calendar", "./pages/hotel/BookingCalendar.tsx"),
      route("permission", "./pages/permission/PermissionList.tsx"),
      route("streets", "./pages/street/StreetList.tsx"),
      route("facilities", "./pages/facilities/FacilityList.tsx"),
    ]),
  ]),
  layout("./layouts/authLayout.tsx", [
    route("login", "./pages/login/LoginPage.tsx"),
    route("register", "./pages/register/RegisterPage.tsx"),
  ]),
  route("404", "./pages/error/NotFound.tsx"),
  route("500", "./pages/error/Error500.tsx"),
  route("*", "./pages/error/NotFound.tsx", { id: "catch-all" }),
] satisfies RouteConfig;
