import { command, form, getRequestEvent, query } from "$app/server";
import { eventCreationSchema, eventID, eventThumbnailSchema } from "#lib/validation.js";
import { error, invalid } from "@sveltejs/kit";

/**
 * Infer the Event Organiser ID from the authenticated user.
 *
 * TODO:
 * Create the `user_profiles` table linked to `event_organisers`,
 * then infer organiser ID from the user profile.
 */
function getOrganiserID(): string {
	return "fd6131ea-d7e0-474b-8ec0-f982d0a69dc8"; // ITea Lab Organiser
}

export const getEventQuestionTypes = query(async () => {
	const sb = getRequestEvent().locals.supabase;
	const { data: questionTypes, error: queryError } = await sb
		.from("question_types")
		.select("*");

	if (queryError) error(500, `Failed to fetch question types: ${queryError.message}`);
	return questionTypes;
})

export const getEvents = query(async () => {})

export const getEvent = query(eventID, async (eventID) => {})

/**
 * Remote function to create an event on the frontend.
 *
 * This function validates the input data
 */
export const createEvent = form(eventCreationSchema, async ({ title, description, start_time, end_time, category, location, survey }, issue) => {
	const sb = getRequestEvent().locals.supabase;

	const { data: { user }, error: userError } = await sb.auth.getUser();
	if (!user || userError) return { success: false, message: 'You must log in to create an event.' };

	// Validate end_time is after start_time
	if (new Date(end_time) <= new Date(start_time)) {
		invalid(issue.end_time('End time must be after start time'))
	}

	const organiser_id = getOrganiserID();

	// Upload event data
	const { data: event, error: eventError } = await sb.from("community_events").insert([{
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
	const { error: surveyError } = await sb.from("registration_questions").insert(
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
 * Remote function to update an event's thumbnail on the frontend.
 *
 * This function validates the input data, uploads the thumbnail to storage,
 * and updates the event with the new thumbnail URL.
 * Successful update will return a success message.
 */
export const updateEventThumbnail = form(eventThumbnailSchema, async ({ eventID, thumbnail }) => {
	const sb = getRequestEvent().locals.supabase;

	const { data: { user }, error: userError } = await sb.auth.getUser();
	if (!user || userError) return { success: false, message: 'You must log in to update an event thumbnail.' };

	// Skip empty thumbnail uploads (no changes)
	if (thumbnail.size === 0) return { success: false, message: 'No changes' };

	// Upload thumbnail file to storage bucket
	const path = `event_thumbnails/${eventID}.${thumbnail.name.split(".").pop()}`;
	const { error: uploadError } = await sb.storage.from("assets")
		.upload(path, thumbnail, { upsert: true });

	if (uploadError) return { success: false, message: `Failed to upload event thumbnail: ${uploadError.message}` };

	// Get the public URL of the uploaded thumbnail
	const { data: { publicUrl } } = sb.storage.from("assets").getPublicUrl(path);

	// Update the event with the new thumbnail URL
	const { error: updateError } = await sb.from("community_events")
		.update({ image: publicUrl })
		.eq("id", eventID);

	if (updateError) return { success: false, message: `Failed to update event thumbnail: ${updateError.message}` };
	return { success: true, message: `Event thumbnail updated successfully.` };
})

export const deleteEvent = command(eventID, async (eventID) => {
	const sb = getRequestEvent().locals.supabase;

	const { data: { user }, error: userError } = await sb.auth.getUser();
	if (!user || userError) return { success: false, message: 'You must log in to delete an event.' };

	const { error: deleteError } = await sb.from("community_events").delete()
		.eq("id", eventID);

	if (deleteError) return { success: false, message: `Failed to delete event: ${deleteError.message}` };
	return { success: true, message: `Event deleted successfully.` };
});
