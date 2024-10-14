import express, { Request, Response } from 'express';

import dotenv from 'dotenv';
import { CheckForNewEventAndEmailAboutItResponse } from './types';
import checkCalForNewEvents from './googleCalendar';
import { sendNewEventEmail } from './nodemailer';
import { calendar_v3 } from 'googleapis';

dotenv.config();

const app = express();

async function checkForNewEventsAndEmailAboutIt(): Promise<CheckForNewEventAndEmailAboutItResponse> {
	try {
		const response: calendar_v3.Schema$Event | null = await checkCalForNewEvents();
		console.log('response in checkForNewEventsAnd...', response);
		if (response) {
			console.log('creating event object for email');
			const event = {
				created: response.created ?? '',
				summary: response.summary ?? '',
				start: (response?.start?.dateTime as string) ?? (response?.start as string) ?? '',
				end: (response?.end?.dateTime as string) ?? (response?.end as string) ?? '',
			};
			console.log('theres a new event to be emailed', event);

			const email = await sendNewEventEmail(event);
			if (!email) {
				console.log('Error in sending email');
				return {
					status: 500,
					message: 'Error in sending email',
				};
			}

			console.log('Email sent successfully');
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
		throw new Error('Error in checking for and emailing new event');
	}
}

app.use('/', async function (req: Request, res: Response) {
	try {
		const response = await checkForNewEventsAndEmailAboutIt();
		if (response.status === 500) {
			throw new Error('Error in sending email');
		}
		res.send(response.message);
	} catch (err: any) {
		console.error(err);
		res.send('Failed.');
	}
});

app.listen(4000, () => {
	console.log('Server running on port 4000');
});
