import 'dotenv/config';
import * as Sentry from '@sentry/node';
import { google, calendar_v3 } from 'googleapis';

import { getAuth } from './auth';
import { CheckForNewEventsResponse } from './types';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// * Lists the next 10 events on the user's primary calendar.
//  */
async function listEvents(auth: any) {
	let calendar = google.calendar({ version: 'v3', auth });

	const res = await calendar.events.list({
		calendarId: process.env.GOOGLE_CALENDAR_ID,
		timeMin: new Date().toISOString(),
		maxResults: 100,
		singleEvents: true,
		orderBy: 'startTime',
	});
	const events = res.data.items;
	if (!events || events.length === 0) {
		Sentry.captureMessage("No upcoming events found.. that's not right, right?.");
		return;
	}

	return events;
}

function checkForNewEvents(events: calendar_v3.Schema$Event[]): CheckForNewEventsResponse {
	for (const event of events) {
		if (typeof event.created === 'string') {
			const createdAt = new Date(event.created).getTime();
			const current = new Date().getTime();

			const difference = current - createdAt;

			if (difference < 9000) {
				return {
					newEvent: true,
					event: event,
				};
			}
		}
	}

	return {
		newEvent: false,
	};
}

// Main execution
export default async function checkCalForNewEvents() {
	try {
		const oauth2Client = getAuth();
		const events = await listEvents(oauth2Client);
		if (!events) {
			throw new Error('No events returned from google');
		}
		const response = checkForNewEvents(events);
		if (response.newEvent) {
			return response.event;
		} else {
			return;
		}
	} catch (error) {
		console.error('Error:', error);
		Sentry.captureException(error);
	}
}
