export const SHELL_ROUTE = "/app/*";

export function matchesGuideRoute(route: string, pathname: string) {
  if (route === SHELL_ROUTE) {
    return pathname.startsWith("/app");
  }

  if (route.endsWith("/*")) {
    const prefix = route.slice(0, -2);
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}
