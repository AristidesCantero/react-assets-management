import { index, route, type RouteConfig } from "@react-router/dev/routes";


export default [
  route("*?", "./pages/Home.tsx"),
  route("Business", "./pages/TableWindows/BusinessWindow.tsx"),
  route("Tests", "./pages/Tests.tsx"),
  route("Headquarters/:headquarterId", "./pages/TableWindows/HeadquartersWindow.tsx"),
] satisfies RouteConfig;