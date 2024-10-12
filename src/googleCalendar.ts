import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import { google, calendar_v3 } from 'googleapis';

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
		maxResults: 100,
		singleEvents: true,
		orderBy: 'startTime',
	});
	const events = res.data.items;
	if (!events || events.length === 0) {
		return;
	}
	events.forEach((event: any) => {
		const start = event.start.dateTime || event.start.date;
	});
	return events;
}

function checkForNewEvents(events: calendar_v3.Schema$Event[]) {
	for (const event of events) {
		if (typeof event.created === 'string') {
			const createdAt = new Date(event.created).getTime();
			// const current = new Date().getTime();
			const current = new Date('2024-07-07T21:05:00.000Z').getTime();
			const difference = current - createdAt;

			if (difference < 7200) {
				return true;
			}
		}
	}
	return false;
}

// Main execution
async function checkCalForNewEvents() {
	try {
		const oauth2Client = getOAuth2Client();
		const events = await listEvents(oauth2Client);
		if (!events) {
			throw new Error('No events returned from google');
		}
		console.log('events: ', events);
		const newEventsPresent = checkForNewEvents(events);
		console.log('new events present: ', newEventsPresent);
		// await listCalendars(oauth2Client);
		return newEventsPresent;
	} catch (error) {
		console.error('Error:', error);
	}
}

async function main() {
	try {
		const result = await checkCalForNewEvents();
		if (result) {
			console.log('are there new events? : ', result);
		}
	} catch (err: any) {
		console.error('issues with checking calendar: ', err);
	}
}

main();
