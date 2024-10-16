import * as Sentry from '@sentry/node';

const { nodeProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
	dsn: process.env.SENTRY_DNS ?? '',
	integrations: [nodeProfilingIntegration()],
	// Tracing
	tracesSampleRate: 1.0, //  Capture 100% of the transactions

	// Set sampling rate for profiling - this is relative to tracesSampleRate
	profilesSampleRate: 1.0,
});
