export const environmentLocal = {
  chromeExtensionId: 'mbpgmaflnlocikfiffhkjehhmnapkjgp',
  safariExtensionId: 'pro.vocably.Vocably.Extension (789D8NRAM6)',
  iosSafariExtensionId: 'pro.vocably.app.Vocably-for-Safari (789D8NRAM6)',
  piwikId: '25473e53-4fde-4fe1-a2ce-273ec6a4d0e3',
  sentryEnvironment: 'dev',
  wwwBaseUrl: 'https://dev.env.vocably.pro',
  revenueCatWeblink: 'https://pay.rev.cat/sandbox/nhscxmehgplykyuc/',
  auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_Tpn3gUQYg',
    userPoolWebClientId: '4j2gqrq3ne32jqee4ddu15p1g4',
    oauth: {
      domain: 'auth.dev.env.vocably.pro',
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      responseType: 'code',
      options: {
        AdvancedSecurityDataCollectionFlag: true,
      },
    },
  },
  api: {
    baseUrl: 'https://api.dev.env.vocably.pro',
    region: 'eu-central-1',
    cardsBucket: 'vocably-dev-cards',
  },
};
