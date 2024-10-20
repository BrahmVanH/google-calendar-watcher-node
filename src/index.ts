import * as Sentry from '@sentry/node';

import express, { Request, Response } from 'express';
import serverless from 'serverless-http';

import dotenv from 'dotenv';
import { CheckForNewEventAndEmailAboutItResponse } from './types';
import checkCalForNewEvents from './googleCalendar';
import { sendNewEventEmail } from './nodemailer';
import { calendar_v3 } from 'googleapis';

dotenv.config();

const { nodeProfilingIntegration } = require('@sentry/profiling-node');

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: process.env.SENTRY_DSN ?? '',
		integrations: [nodeProfilingIntegration()],
		// Tracing
		tracesSampleRate: 1.0, //  Capture 100% of the transactions

		// Set sampling rate for profiling - this is relative to tracesSampleRate
		profilesSampleRate: 1.0,
	});
}

const app = express();

async function checkForNewEventsAndEmailAboutIt(): Promise<CheckForNewEventAndEmailAboutItResponse> {
	try {
		const response: calendar_v3.Schema$Event | null = await checkCalForNewEvents();
		if (response) {
			const event = {
				created: response.created ?? '',
				summary: response.summary ?? '',
				start: (response?.start?.dateTime as string) ?? (response?.start as string) ?? '',
				end: (response?.end?.dateTime as string) ?? (response?.end as string) ?? '',
			};

			const email = await sendNewEventEmail(event);
			if (!email) {
				return {
					status: 500,
					message: 'Error in sending email',
				};
			}

			return {
				status: 200,
				message: 'Email sent successfully',
			};
		}

		return {
			status: 200,
			message: 'No new events found',
		};
	} catch (err: any) {
		console.error(err);
		Sentry.captureException(err);
		throw new Error('Error in checking for and emailing new event');
	}
}

app.use('/', async function (req: Request, res: Response) {
	try {
		const response = await checkForNewEventsAndEmailAboutIt();
		if (response.status === 500) {
			throw new Error('Error in sending email');
		}
		console.log('response.message', response.message);
		res.send(response.message);
	} catch (err: any) {
		console.error(err);
		Sentry.captureException(err);
		res.send('Failed.');
	}
});

Sentry.setupExpressErrorHandler(app);

const handler = serverless(app);

export { handler };
