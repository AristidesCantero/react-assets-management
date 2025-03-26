import { index, route, type RouteConfig } from "@react-router/dev/routes";


export default [
  // index("./pages/Home.tsx"),
  route("*?", "./catchall.tsx"),
  route("Home", "./pages/Home.tsx"),
  route("Business", "./pages/BusinessWindow.tsx"),
  route("Tests", "./pages/Tests.tsx"),
] satisfies RouteConfig;