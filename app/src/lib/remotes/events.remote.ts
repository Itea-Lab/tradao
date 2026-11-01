import { command, form, getRequestEvent, query } from "$app/server";
import { createSupabaseClient } from "#lib/supabase.js";
import { eventCreationSchema, eventID, eventRegistrationSchema } from "#lib/validation.js";
import { error, invalid, redirect } from "@sveltejs/kit";
import { ulid } from "ulid";

const client = createSupabaseClient();

/**
 * Upload the event thumbnail image to the storage bucket
 * @param thumbnail Thumbnail image file
 * @returns Public URL of the thumbnail image, none if empty
 */
async function uploadEventThumbnail(client: ReturnType<typeof createSupabaseClient>,thumbnail: File) {
	if (thumbnail.size === 0) return "";

	const ext = thumbnail.name.split(".").pop();
	const path = `event_thumbnails/${ulid()}.${ext}`;

	const { error: uploadError } = await client
		.storage
		.from("assets")
		.upload(path, thumbnail, { upsert: true });

	if (uploadError) {
		error(500, `Failed to upload event thumbnail: ${uploadError.message}`);
	}

	const { data: { publicUrl } } = client
		.storage
		.from("assets")
		.getPublicUrl(path);

	return publicUrl;
}

/**
 * Infer the Event Organiser ID from the authenticated user.
 *
 * TODO: Create the `user_profiles` table linked to `event_organisers`, then infer organiser ID from the user profile.
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
export const createEvent = form(eventCreationSchema, async ({ title, description, start_time, end_time, category, location, survey }, issue) => {
	const { locals } = getRequestEvent();
	const { user } = await locals.safeGetSession();
	if (!user) return { success: false, message: 'You must log in to create an event.' };
	const db = locals.supabase;

	// Validate end_time is after start_time
	if (new Date(end_time) <= new Date(start_time)) {
		invalid(issue.end_time('End time must be after start time'))
	}

	const organiser_id = getOrganiserID();

	// Upload event data
	const { data: event, error: eventError } = await db.from("community_events").insert([{
		title,
		description,
		start_time,
		end_time,
		category,
		location,
		organiser_id,
	}]).select().single();

	if (eventError) return { success: false, message: `Failed to create event: ${eventError.message}` };
	if (!event) return { success: false, message: 'Cannot identify the created event. Please contact support.' };

	// Upload survey questions
	const { error: surveyError } = await db.from("registration_questions").insert(
		survey.map((q) => ({
			event_id: event.id,
			question_type: q.type,
			question_text: q.question,
		}))
	).select();

	if (surveyError) return { success: false, message: `Failed to create survey questions: ${surveyError.message}` };
	return { success: true, message: `Event created successfully: ${event.title}` };
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

export const deleteEvent = command(eventID, async (eventID) => {
	console.debug(`Deleting event with ID: ${eventID}`);

	const { locals } = getRequestEvent();
	const { user } = await locals.safeGetSession();
	if (!user) return { success: false, message: 'You must log in to delete an event.' };
	const db = locals.supabase;

	const { error: deleteError } = await db.from("community_events").delete()
		.eq("id", eventID);

	if (deleteError) return { success: false, message: `Failed to delete event: ${deleteError.message}` };
	return { success: true, message: `Event deleted successfully.` };
});
