import { Body, Html, pixelBasedPreset, Tailwind } from "react-email";
import { colours, EmailHead, EventData } from "./common";

/**
 * Event Feedback Email Template
 *
 * This email template is designed to collect feedback from attendees after an event has concluded.
 * The email is sent at 20:00 on the day of the event.
 */
export const EventFeedback = (props: EventData) => (
	<Html>
		<EmailHead subject={EventFeedback.Subject(props)} />
		<Tailwind config={{ presets: [pixelBasedPreset] }}>
			<Body className={`px-[1.5rem] font-sans text-[${colours.fg}]`}>
			</Body>
		</Tailwind>
	</Html>
)

EventFeedback.Subject = (props: EventData) =>
	`[Test mail|Google pls spare me] How was ${props.title}? We value your feedback!`;

export default EventFeedback;
