export enum RouterConfig {
  MAIN = 'main',
  AUTH = 'auth',
}

export const RoutePath: Record<RouterConfig, string> = {
  [RouterConfig.MAIN]: '/',
  [RouterConfig.AUTH]: '/auth',
}
