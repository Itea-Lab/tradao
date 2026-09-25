import {
	Body, Container, Html, Img, Markdown, pixelBasedPreset,
	pretty, Preview, render, Tailwind, Text, toPlainText
} from "react-email"
import { colours, EmailHead, EventData, LogoHeader } from "./common";

/**
 * Event Reminder Email Template
 *
 * This email template is designed to remind attendees about an upcoming event.
 * The email is sent at 20:00 the day before the event.
 */
export const EventReminder = (props: EventData) => (
	<Html>
		<EmailHead subject={EventReminder.Subject(props)} />
		<Tailwind config={{ presets: [pixelBasedPreset] }}>
			<Body className={`px-[1.5rem] font-sans text-[${colours.fg}]`}>
				<Preview>{EventReminder.Subject(props)}</Preview>
				<LogoHeader />
				<EventReminder.LetterCard {...props} />
				<Text className="max-w-md mx-auto text-center">
					If you have any questions or need assistance, feel free to reach out to our support team at
					{' '}<a href="mailto:contact.itealab@gmail.com">contact.itealab@gmail.com</a>
				</Text>
			</Body>
		</Tailwind>
	</Html>
)

/**
 * Subject line
 */
EventReminder.Subject = (props: EventData) =>
	`[Test mail|Google pls spare me] ${props.title} Starts Tomorrow!`;

/**
 * The main card that contains the event image and details.
 */
EventReminder.LetterCard = (props: EventData) => (
	<Container
		className={`mx-auto my-[1rem] bg-[${colours.bg}] border-3 border-[${colours.fg}] rounded-[1rem]`}>
		<Img
			width="100%"
			height="auto"
			className="rounded-[1rem]"
			src={props.image}
			alt={props.title} />

		<Markdown markdownContainerStyles={{ padding: "1rem" }}>
			{EventReminder.MarkdownBody(props)}
		</Markdown>
	</Container>
);

/**
 * Email letter in Markdown
 */
EventReminder.MarkdownBody = (props: EventData) => `
Dear esteemed attendees,

Thank you for registering to participate in our upcoming event,
the **${props.title}**! We are excited to have you join us for this event.

This email serves as a friendly reminder and confirmation of the event details:

- **Title**: ${props.title}
- **Category**: ${props.category}
- **Description**: ${props.description ?? "N/A"}
- **Start Time**: ${formatDateTime(props.start_time)}
- **End Time**: ${formatDateTime(props.end_time)}
- **Location**: ${props.location ?? "N/A"}

Here are some directions for arriving and parking at Swinburne Vietnam, HCMC:

- **Find on Google Maps**: [Swinburne Vietnam - HCMC Campus](https://maps.app.goo.gl/4AuJSrnUQgUfHC716)
- **By Car**: Parking for cars is available at the nearby Blue Sky tower.
- **By Motorbike**: In-campus parking is accessible from the alleyway next to the campus. We, however, recommend parking at Blue Sky tower due to limited availability.

We look forward to seeing you there!

Best regards,
The ITea Lab Team
`

EventReminder.PreviewProps = {
	id: "event-1",
	organiser_id: "organiser-1",
	title: "Fictional Software Testing Workshop",
	category: "Workshop",
	description: "Learn about metamorphic testing, proportional testing strategies, mutation testing, and their applications.",
	start_time: "2026-07-01T01:00:00Z",
	end_time: "2026-07-01T03:00:00Z",
	location: "Brighton Beach Auditorium, Level 13, A35 Bach Dang, Ho Chi Minh City, Vietnam",
	image: "https://placehold.co/1600x900",
	created_at: "2026-03-20T12:00:00Z",
	updated_at: "2026-03-23T12:00:00Z",
} as EventData;

EventReminder.compile = async function (props: EventData) {
	return await render(<EventReminder {...props} />)
		.then(html => pretty(html))
		.then(html => ({ html, text: toPlainText(html), }));
}

function formatDateTime(dateTimeStr: string) {
	return new Date(dateTimeStr).toLocaleString("en-AU", {
		month: "long",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZoneName: "shortOffset",
	});
}

export default EventReminder;
