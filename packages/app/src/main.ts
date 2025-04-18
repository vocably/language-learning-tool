import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Auth } from '@aws-amplify/auth';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { configureApi } from '@vocably/api';
import posthog from 'posthog-js';
import { maintainAppSize } from './app-size';
import { AppModule } from './app/app.module';
import { authConfig } from './auth-config';
import { environment } from './environments/environment';

posthog.init('phc_vke56i7RTlBbFYHZHsoH7VhgWi2DwvKtEzusfcFemgT', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

Sentry.init({
  environment: environment.sentryEnvironment,
  dsn: 'https://3e78a7263b224f07a7316c655d40a415@o1191770.ingest.sentry.io/6313273',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

Auth.configure(authConfig);

configureApi({
  ...environment.api,
  getJwtToken: () =>
    Auth.currentSession().then((session) => session.getIdToken().getJwtToken()),
});

maintainAppSize();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
