import { WorkerMailer } from "worker-mailer";

import { formatDateTime } from "./templates/common";
import EventReminder from "./templates/EventReminder";
import supabase from "./database";

export default {
	async scheduled(_event, env, _ctx): Promise<void> {
		console.log(`${formatDateTime(new Date())}:`);

		// 1. Query for events starting the next day
		// e.g. whose start_time is within 00:00 and 23:59 of the next day
		const tmrStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const tmrEnd = new Date(tmrStart.getTime() + 23 * 60 * 60 * 1000);
		const { data: events } = await supabase
			.from('community_events')
			.select('*, event_tickets(email)')
			.gte('start_time', tmrStart.toISOString())
			.lte('start_time', tmrEnd.toISOString());

		if (!events) return;

		// 1b. If no events, exit early
		if (events.length === 0) {
			console.log("- No events starting tomorrow");
			return;
		}

		// 1c. Log events found to happen tomorrow
		console.log(`- Found ${events.length} event(s) starting tomorrow:`);
		for (const event of events) {
			console.log(`  - ${event.title} (${event.start_time})`);
		}

		// 2. Construct email notification
		const bccs = events.flatMap(event => event.event_tickets.map(ticket => ticket.email));
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
		console.log(`- BCC: ${bccs.join(', ')}`);
		await mailer.send({
			from: { name: env.MAIL_FROM_NAME, email: env.MAIL_FROM_EMAIL },
			to: env.MAIL_TO_EMAIL,
			bcc: bccs,
			subject: EventReminder.Subject(eventData),
			html: emailContent.html,
			text: emailContent.text,
		});
	},

	async fetch(_req) {
		return new Response();
	},
} satisfies ExportedHandler<Env>;
