import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

function getOAuth2Client() {
	const oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.GOOGLE_REDIRECT_URI // Usually http://localhost:3000/oauth2callback for local dev
	);

	if (process.env.GOOGLE_REFRESH_TOKEN) {
		oauth2Client.setCredentials({
			refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
		});
	}

	return oauth2Client;
}

// * Lists the next 10 events on the user's primary calendar.
//  */
async function listEvents(auth: OAuth2Client) {
	const calendar = google.calendar({ version: 'v3', auth });
	const res = await calendar.events.list({
		calendarId: process.env.GOOGLE_CALENDAR_ID,
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	});
	const events = res.data.items;
	if (!events || events.length === 0) {
		console.log('No upcoming events found.');
		return;
	}
	console.log('Upcoming 10 events:');
	events.forEach((event: any) => {
		const start = event.start.dateTime || event.start.date;
		console.log(`${start} - ${event.summary}`);
	});
}

async function listCalendars(auth: OAuth2Client) {
	const calendar = google.calendar({ version: 'v3', auth });
	const res = await calendar.calendarList.list();
	const calendars = res.data.items;
	if (!calendars || calendars.length === 0) {
		console.log('No calendars found.');
		return;
	}
	console.log('Calendars:');
	calendars.forEach((calendar: any) => {
		console.log(`${calendar.id} - ${calendar.summary}`);
	});
}

// Main execution
async function main() {
	try {
		const oauth2Client = getOAuth2Client();
		await listEvents(oauth2Client);
		// await listCalendars(oauth2Client);
	} catch (error) {
		console.error('Error:', error);
	}
}

main();
