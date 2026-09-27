import { WorkerMailer } from "worker-mailer";

import { formatDateTime } from "./templates/common";
import EventReminder from "./templates/EventReminder";

export default {
	async scheduled(_event, env, _ctx): Promise<void> {
		console.log(`${formatDateTime(new Date())}:`);

		// 1. Query for events starting the next day
		// TODO: Replace with fetch from Supabase
		const events = [
			EventReminder.PreviewProps
		];

		// 1b. If no events, exit early
		if (events.length === 0) {
			console.log("- No events starting tomorrow");
			return;
		}

		// 2. Construct email notification
		const eventData = events[0];
		const emailContent = await EventReminder.compile(eventData);

		// 3. Connect to SMTP server
		console.log(`- Logging in as ${env.SMTP_USER}`);
		const mailer = await WorkerMailer.connect({
			authType: "plain",
			// secure: true,
			host: env.SMTP_HOST,
			port: Number.parseInt(env.SMTP_PORT),
			credentials: {
				username: env.SMTP_USER,
				password: env.SMTP_PASS,
			},
		});

		// 4. Send email
		console.log(`- Sending from ${env.MAIL_FROM_NAME} <${env.MAIL_FROM_EMAIL}>`);
		console.log(`- Sending to ${env.MAIL_TO_EMAIL}`);
		await mailer.send({
			from: { name: env.MAIL_FROM_NAME, email: env.MAIL_FROM_EMAIL },
			to: env.MAIL_TO_EMAIL,
			bcc: [],
			subject: EventReminder.Subject(eventData),
			html: emailContent.html,
			text: emailContent.text,
		});
	},

	async fetch(_req) {
		return new Response();
	},
} satisfies ExportedHandler<Env>;
