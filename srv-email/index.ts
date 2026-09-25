import dotenv from "dotenv";
import express from "express";
import { Address, createMessage } from "@upyo/core";
import { MockTransport } from "@upyo/mock";
import { SmtpTransport } from "@upyo/smtp";
import EventReminder from "./emails/EventReminder";

dotenv.config();

const environment = process.env.ENVIRONMENT || "dev";

const smtpConfig = {
	port: Number.parseInt(process.env.SMTP_PORT || "587"),
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	user: process.env.SMTP_USER || "",
	pass: process.env.SMTP_PASS || "",
};

if (environment === "prod") {
	if (!smtpConfig.user) throw new Error("Cannot get SMTP_USER");
	if (!smtpConfig.pass) throw new Error("Cannot get SMTP_PASS");
	if (Number.isNaN(smtpConfig.port)) smtpConfig.port = 587;
}

// Mock transporter
const transporter = environment === "dev"
	? new MockTransport()
	: new SmtpTransport({
		secure: false,
		host: smtpConfig.host,
		port: smtpConfig.port,
		auth: { user: smtpConfig.user, pass: smtpConfig.pass },
	});

const app = express();
app.disable("x-powered-by");

app.get("/", (_, res) => {
	res.send("Hello from the Emails service!");
});

app.get("/sent-emails", (_, res) => {
	res.json(transporter instanceof MockTransport ? transporter.getSentMessages() : []);
});

app.post("/send-test-email", async (_, res) => {
	/** Hardcoded event data, will fetch from Supabase later */
	const event = {
		id: "event-1",
		organiser_id: "organiser-1",
		title: "Fictional Software Testing Workshop",
		category: "Workshop",
		description: "Learn about metamorphic testing, proportional testing strategies, mutation testing, and their applications.",
		start_time: "2026-07-01T10:00:00Z",
		end_time: "2026-07-01T13:00:00Z",
		location: "Wantirna Room, Level 15, A35 Bach Dang, Ho Chi Minh City, Vietnam",
		image: "https://placehold.co/1600x900",
		created_at: "2026-03-20T12:00:00Z",
		updated_at: "2026-03-23T12:00:00Z",
	};

	/** Hardcoded attendees, will fetch from Supabase later */
	const attendees: Address[] = [
		{ address: "trietntm@hotmail.com" },
	];

	// Generate email content
	const emailContent = await EventReminder.compile(event);

	// Create the email message
	const message = createMessage({
		// Who to who
		from: { name: 'Minh-Triet at ITea Lab', address: "djv137nam@gmail.com" },
		to: 'djv137nam@gmail.com',
		bcc: attendees,

		// Content
		subject: EventReminder.Subject(event),
		content: emailContent,
		tags: ["event-reminder", "workshop"],
		attachments: [],
	});

	// Send the email and log the result
	const receipt = await transporter.send(message);
	receipt.successful
		? res.send(`Email sent successfully! Message ID: ${receipt.messageId}`)
		: res.status(500).send(`Failed to send email: ${receipt.errorMessages.join(", ")}`);
});

const PORT = process.env.PORT || 8000;
app.listen((PORT), () => {
	console.log(`Emails service is running in ${environment} mode on port ${PORT}`);
});
