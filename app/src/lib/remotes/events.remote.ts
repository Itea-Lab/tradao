import { form, query } from "$app/server";
import { createSupabaseClient } from "#lib/supabase.js";
import { eventCreationSchema, eventID, eventRegistrationSchema } from "#lib/validation.js";
import { error, invalid, redirect } from "@sveltejs/kit";

const client = createSupabaseClient();

/**
 * Infer the Event Organiser ID from the authenticated user.
 * TODO: Replace hardcoded value
 */
function getOrganiserID(): string {
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
export const createEvent = form(eventCreationSchema, ({ title, description, start_time, end_time, category, location, thumbnail, survey }, issue) => {
	// Validate end_time is after start_time
	if (new Date(end_time) <= new Date(start_time)) {
		invalid(issue.end_time('End time must be after start time'))
	}

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
});

/**
 * Remote function to register an event on the frontend.
 *
 * This function validates the input data, creates a ticket in the "event_tickets" table,
 * and stores the survey answers in the "registration_answers" table.
 * Successful registration will redirect the user to the ticket page.
 */
export const registerEvent = form(eventRegistrationSchema, async ({ eventID, name, email, surveyAnswers }) => {
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
});
