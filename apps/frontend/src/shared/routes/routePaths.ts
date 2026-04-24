export enum RouterConfig {
  MAIN = 'main',
  AUTH = 'auth',
  SHIPMENTS = 'shipments',
}

export const RoutePath: Record<RouterConfig, string> = {
  [RouterConfig.MAIN]: '/',
  [RouterConfig.AUTH]: '/auth',
  [RouterConfig.SHIPMENTS]: '/shipments',
}
