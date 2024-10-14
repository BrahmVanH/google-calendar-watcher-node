import * as Sentry from '@sentry/node';
import nodemailer from 'nodemailer';
import { RelevantEventInfo } from './types';

export const sendNewEventEmail = async (relevantEventInfo: RelevantEventInfo) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST ?? '',
		port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
		auth: {
			user: process.env.SMTP_USER ?? '',
			pass: process.env.SMTP_PASS ?? '',
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_USER ?? '',
		to: process.env.SMTP_USER ?? '',
		subject: `New event in MQT Movers calendar`,
		text: `Event: \n		created: ${relevantEventInfo.created}\n			summary: ${relevantEventInfo.summary}\n			Start:\n			time: ${relevantEventInfo.start}`,
	};

	try {
		const email = await transporter.sendMail(mailOptions);

		if (!email) {
			throw new Error('Error sending email');
		}

		return email;
	} catch (error) {
		console.error(error);
		Sentry.captureException(error);
		throw new Error('Error sending email');
	}
};
