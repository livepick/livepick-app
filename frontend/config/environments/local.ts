import type { EnvironmentConfig } from '../environment'

export const localConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://localhost:8080',
    prefix: '/api/v1',
  },
  auth: {
    googleClientId: '',
    redirectUrl: 'http://localhost:3100/auth/callback',
  },
  features: {
    enableMockData: true,
    enableDebug: true,
  },
}
