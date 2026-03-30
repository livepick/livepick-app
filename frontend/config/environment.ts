import { localConfig } from './environments/local'
import { devConfig } from './environments/dev'
import { prodConfig } from './environments/prod'

export type Environment = 'local' | 'dev' | 'prod'

export interface EnvironmentConfig {
  api: {
    baseUrl: string
    prefix: string
  }
  auth: {
    googleClientId: string
    redirectUrl: string
  }
  features: {
    enableMockData: boolean
    enableDebug: boolean
  }
}

export function detectEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_APP_ENV
  if (env === 'dev' || env === 'prod') return env
  return 'local'
}

const configs: Record<Environment, EnvironmentConfig> = {
  local: localConfig,
  dev: devConfig,
  prod: prodConfig,
}

export function getConfig(): EnvironmentConfig {
  return configs[detectEnvironment()]
}

export function getApiConfig(): EnvironmentConfig['api'] {
  return getConfig().api
}

export function getAuthConfig(): EnvironmentConfig['auth'] {
  return getConfig().auth
}

export function isMockEnabled(): boolean {
  return getConfig().features.enableMockData
}

export function isDebugEnabled(): boolean {
  return getConfig().features.enableDebug
}
