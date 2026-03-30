import type { EnvironmentConfig } from '../environment'

export const devConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://api-dev.livepick.app',
    prefix: '/api/v1',
  },
  auth: {
    googleClientId: '',
    redirectUrl: 'https://dev.livepick.app/auth/callback',
  },
  features: {
    enableMockData: false,
    enableDebug: true,
  },
}
