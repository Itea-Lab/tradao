import yup from "yup";
import { form, query } from "$app/server";
import { createSupabaseClient } from "#lib/supabase.js";
import { error, redirect } from "@sveltejs/kit";

const client = createSupabaseClient();

const eventID = yup
	.string()
	.trim().required('Event ID is required')
	.uuid('Event ID must be a valid UUID');

/**
 * Infer the Event Organiser ID from the authenticated user.
 *
 * TODO: Replace hardcoded value
 */
function getOrganiserID() {
	return "fd6131ea-d7e0-474b-8ec0-f982d0a69dc8"; // ITea Lab Organiser
}

export const getEventParticipants = query(eventID, async (eventID) => {
	const { data: participants, error: queryError } = await client
		.from("event_tickets")
		.select("*")
		.eq("event_id", eventID);

	if (queryError) error(500, `Failed to fetch attendees: ${queryError.message}`);
	return participants;
})

export const getEventQuestionTypes = query(async () => {
	const { data: questionTypes, error: queryError } = await client
		.from("question_types")
		.select("*");

	if (queryError) error(500, `Failed to fetch question types: ${queryError.message}`);
	return questionTypes;
})

/**
 * Remote function to create an event on the frontend.
 *
 * This function validates the input data
 */
export const createEvent = form(
	yup.object({
		title: yup.string()
			.trim().required('Event title is required'),

		start_time: yup.string()
			.trim().required('Event start time is required')
			.datetime({ allowOffset: true, message: 'Start time must be of valid format' }),

		end_time: yup.string()
			.trim().required('Event end time is required')
			.datetime({ allowOffset: true, message: 'End time must be of valid format' })
			.test('end-after-start', 'End time must be after start time', function (value) {
				const { start_time } = this.parent;
				if (!value || !start_time) return true;
				return new Date(value) > new Date(start_time);
			}),

		location: yup.string()
			.default('A35 Bach Dang, Tan Binh Ward, Ho Chi Minh City, Vietnam'),

		category: yup.string()
			.trim().required('Event category is required'),

		thumbnail: yup.mixed<File>()
			.default(new File([], "", { type: "image/jpeg" }))
			.test('file', 'Image file must be a file', (value) => value instanceof File)
			.test('size', 'File must be 5 MB or smaller', (value) =>
				value instanceof File ? value.size <= 5 * 1024 * 1024 : true
			)
			.test('type', 'Only images are allowed', (value) =>
				value instanceof File ? value.type.startsWith('image/') : true
			),

		description: yup.string()
			.trim()
			.default(''),

		survey: yup
			.array()
			.of(
				yup.object({
					question: yup.string()
						.trim().required('Survey question is required'),

					type: yup
						.string()
						.oneOf(["text", "select", "boolean", "number", "date", "file"])
						.required('Survey question type is required'),

					options: yup.array().of(
						yup.string()
							.trim()
							.required('Option text is required')
					)
				})
			)
			.default([]),
	}),
	({ title, description, start_time, end_time, category, location, thumbnail, survey }) => {
		const organiser_id = getOrganiserID();

		console.group("Creating Event");
		console.debug("Organiser ID:", organiser_id);
		console.debug("Title:", title);
		console.debug("Start Time:", start_time);
		console.debug("End Time:", end_time);
		console.debug("Category:", category);
		console.debug("Location:", location);
		console.debug("Image File:", thumbnail?.name ?? "No image uploaded");
		console.debug("Description:", description);
		console.debug("Survey Questions:");
		survey.forEach((q, i) => {
			console.debug(`  Question ${i + 1}: ${q.question} (${q.type})`);
		});
		console.groupEnd();
	}
);

/**
 * Remote function to register an event on the frontend.
 *
 * This function validates the input data, creates a ticket in the "event_tickets" table,
 * and stores the survey answers in the "registration_answers" table.
 * Successful registration will redirect the user to the ticket page.
 */
export const registerEvent = form(
	yup.object({
		// Event ID
		eventID: eventID,

		// Participant Name
		name: yup
			.string()
			.trim().required('Name is required')
			.matches(/^[\p{L}\s-]+$/u, 'Name must contain only letters, spaces, and hyphens'),

		// Participant Email
		email: yup
			.string()
			.trim().required('Email is required')
			.email(),

		// Survey Answers
		surveyAnswers: yup
			.array()
			.required('Survey answers are required')
			.of(
				yup.object({
					questionID: yup.string().uuid().required('Question ID is required'),
					answer: yup.string().required('Answer is required'),
				}).required()
			),
	}),
	async ({ eventID, name, email, surveyAnswers }) => {
		// Upload the base ticket
		const { data: ticket, error: ticketError } = await client.from("event_tickets").insert([{
			event_id: eventID,
			name,
			email,

			// TODO: Deprecate these fields
			academic_year: "other",
			field_of_study: "other",
			major: "other",
		}]).select().single();

		if (ticketError) error(500, `Failed to create ticket: ${ticketError.message}`);
		if (!ticket) error(500, 'Cannot identify the created ticket. Please contact support.');

		// Upload the survey answers
		const { error: surveyError } = await client.from("registration_answers").insert(
			surveyAnswers.map((answer) => ({
				ticket_id: ticket.id,
				question_id: answer.questionID,
				answer_text: answer.answer,
			}))
		).select();

		if (surveyError) error(500, `Failed to create survey answers: ${surveyError.message}`);
		redirect(303, `/tickets/${ticket.id}`);
	}
);
