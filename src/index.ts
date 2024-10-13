import '../instrument';

import * as Sentry from '@sentry/node';

import express, { Request, Response } from 'express';
import serverless from 'serverless-http';

import dotenv from 'dotenv';
import { CheckForNewEventsResponse } from './types';
import checkCalForNewEvents from './googleCalendar';
import { sendNewEventEmail } from './nodemailer';

dotenv.config();

const app = express();

async function checkForNewEventsAndEmailAboutIt() {
	try {
		const response: CheckForNewEventsResponse = await checkCalForNewEvents();
		if (response.newEvent) {
			const event = {
				created: response.event.created,
				summary: response.event.summary,
				start: {
					dateTime: response.event.start.dateTime,
					timeZone: response.event.start.timeZone,
				},
			};

			const email = await sendNewEventEmail(event);
			if (!email) {
				throw new Error('No email response');
			}
		}
	} catch (err: any) {
		console.error(err);
		Sentry.captureException(err);
		throw new Error('Error in checking for and emailing new event');
	}

	return null;
}

app.use('/', async function (req: Request, res: Response) {
	try {
		await checkForNewEventsAndEmailAboutIt();
		res.send('Success');
	} catch (err: any) {
		console.error(err);
		Sentry.captureException(err);
		res.send('Failed.');
	}
});

Sentry.setupExpressErrorHandler(app);

const handler = serverless(app);

export { handler };
