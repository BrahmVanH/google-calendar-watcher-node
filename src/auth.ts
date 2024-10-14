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


