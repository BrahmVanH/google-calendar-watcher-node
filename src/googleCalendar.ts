import * as Sentry from '@sentry/node';
import { google, calendar_v3 } from 'googleapis';
import dotenv from 'dotenv';

import { getJwtClient } from './auth';
import { CheckForNewEventsResponse } from './types';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// * Lists the next 10 events on the user's primary calendar.
//  */
async function listEvents(auth: any) {
	let calendar = google.calendar({ version: 'v3' });

	const res = await calendar.events.list({
		calendarId: process.env.GOOGLE_CALENDAR_ID,
		auth: auth,
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
		const jwtClient = getJwtClient();
		const events = await listEvents(jwtClient);
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
