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

/**
 * Remote function to query all survey question types
 */
export const getEventQuestionTypes = query(async () => {
	const sb = getRequestEvent().locals.supabase;
	const { data: questionTypes, error: queryError } = await sb
		.from("question_types")
		.select("*");

	if (queryError) error(500, `Failed to fetch question types: ${queryError.message}`);
	return questionTypes;
})

/**
 * Remote function to query all events
 */
export const getEvents = query(async () => {
	const sb = getRequestEvent().locals.supabase;
	const { data: events, error: queryError } = await sb
		.from("community_events")
		.select("*")
		.order("start_time", { ascending: false });

	if (queryError) error(500, queryError.message);
	return events;
})

/**
 * Remote function to create an event on the frontend.
 *
 * This function validates the input data
 */
export const createEvent = form(eventCreationSchema, async (form, issue) => {
	const sb = getRequestEvent().locals.supabase;

	const { data: { user }, error: userError } = await sb.auth.getUser();
	if (!user || userError) return { success: false, message: 'You must log in to create an event.' };

	// Validate end_time is after start_time
	if (new Date(form.end_time) <= new Date(form.start_time)) {
		invalid(issue.end_time('End time must be after start time'))
	}

	const organiser_id = getOrganiserID();

	// Upload event data
	const { data: event, error: eventError } = await sb.from("community_events")
		.insert([{ ...form, organiser_id, }])
		.select().single();

	if (eventError) return { success: false, message: `Failed to create event: ${eventError.message}` };
	if (!event) return { success: false, message: 'Cannot identify the created event. Please contact support.' };

	// Upload survey questions
	const { error: surveyError } = await sb.from("registration_questions").insert(
		form.survey.map((q) => ({
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

export const updateEventThumbnail = form(
  eventThumbnailSchema,
  async ({ eventID, thumbnail }) => {
    const sb = getRequestEvent().locals.supabase;

    const {
      data: { user },
      error: userError
    } = await sb.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        message: 'You must log in to update an event thumbnail.'
      };
    }

    if (!thumbnail || thumbnail.size === 0) {
      return {
        success: false,
        message: 'No changes'
      };
    }

    const extension = thumbnail.name.split('.').pop();
    const path = `event_thumbnails/${eventID}.${extension}`;

    try {
      // Explicitly convert File to ArrayBuffer
      const fileBuffer = await thumbnail.arrayBuffer();

      console.log('Thumbnail upload debug:', {
        name: thumbnail.name,
        size: thumbnail.size,
        bufferSize: fileBuffer.byteLength,
        type: thumbnail.type
      });

      if (fileBuffer.byteLength === 0) {
        return {
          success: false,
          message: 'Thumbnail file is empty.'
        };
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await sb.storage
        .from('assets')
        .upload(path, fileBuffer, {
          upsert: true,
          contentType: thumbnail.type || 'image/jpeg'
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);

        return {
          success: false,
          message: `Failed to upload event thumbnail: ${uploadError.message}`
        };
      }

      // Get public URL
      const { data: { publicUrl } } = sb.storage
        .from('assets')
        .getPublicUrl(path);

      // Update database
      const { error: updateError } = await sb
        .from('community_events')
        .update({ image: publicUrl })
        .eq('id', eventID);

      if (updateError) {
        console.error('Database update error:', updateError);

        return {
          success: false,
          message: `Failed to update event thumbnail: ${updateError.message}`
        };
      }

      return {
        success: true,
        message: 'Event thumbnail updated successfully.'
      };

    } catch (error) {
      console.error('Thumbnail upload exception:', error);

      return {
        success: false,
        message: 'Unexpected error uploading thumbnail.'
      };
    }
  }
);

export const deleteEvent = command(eventID, async (eventID) => {
	const sb = getRequestEvent().locals.supabase;

	const { data: { user }, error: userError } = await sb.auth.getUser();
	if (!user || userError) return { success: false, message: 'You must log in to delete an event.' };

	const { error: deleteError } = await sb.from("community_events").delete()
		.eq("id", eventID);

	if (deleteError) return { success: false, message: `Failed to delete event: ${deleteError.message}` };
	return { success: true, message: `Event deleted successfully.` };
});
