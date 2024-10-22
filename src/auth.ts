import * as Sentry from '@sentry/node';
import { google } from 'googleapis';

export function getAuth() {
	const client_secret = process.env.GOOGLE_CLIENT_SECRET ?? '';
	const client_id = process.env.GOOGLE_CLIENT_ID ?? '';
	const redirect_uri = process.env.GOOGLE_REDIRECT_URI ?? '';
	const refresh_token = process.env.GOOGLE_REFRESH_TOKEN ?? '';
	if (!client_secret || !client_id || !redirect_uri || !refresh_token) {
		throw new Error('Missing environment variables for Google OAuth');
	}

	const client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
	client.setCredentials({ refresh_token });

	return client;
}

export function getJwtClient() {
	console.log('Getting JWT client');
	const clientEmail = process.env.GOOGLE_CLIENT_EMAIL ?? '';
	const privateKey = process.env.GOOGLE_PRIVATE_KEY ?? '';
	if (!clientEmail || !privateKey) {
		Sentry.captureMessage('Missing environment variables for Google JWT');
		throw new Error('Missing environment variables for Google JWT');
	}
	const jwtClient = new google.auth.JWT(
		clientEmail,
		undefined,
		// Note: Make sure to handle newlines in the private key
		privateKey.replace(/\\n/g, '\n'),
		['https://www.googleapis.com/auth/calendar.readonly']
	);
	if (!jwtClient) {
		Sentry.captureMessage('Failed to authenticate JWT client');
		throw new Error('Failed to authenticate JWT client');
	}
	console.log('Returning JWT client');
	return jwtClient;
}
