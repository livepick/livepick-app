import type { EnvironmentConfig } from '../environment'

export const prodConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://api.livepick.app',
    prefix: '/api/v1',
  },
  auth: {
    googleClientId: '',
    redirectUrl: 'https://livepick.app/auth/callback',
  },
  features: {
    enableMockData: false,
    enableDebug: false,
  },
}
