import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (
	{ params, locals: { supabase } },
) => {
	const identifier = params.id;

	// UUID v4 regex
	const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	const isUuid = uuidV4.test(identifier);

	const query = supabase
		.from("community_events")
		.select("*, organiser: event_organisers( * )")
		.limit(1);

	const { data: event, error: eventError } = isUuid
		? await query.eq("id", identifier).single()
		: await query.eq("slug", identifier).single();

	const { data: academicStatus, error: statusError } = await supabase
		.from("academic_status")
		.select("*");

	const { data: fieldsOfStudy, error: fieldsError } = await supabase
		.from("fields_of_study")
		.select("*");

	if (eventError) throw eventError;
	if (statusError) throw statusError;
	if (fieldsError) throw fieldsError;

	if (!event) throw error(404, "Event not found");

	// Optional: canonicalize URLs — if user requested by UUID, redirect to slug URL
	// if (isUuid && event.slug) throw redirect(301, `/events/${event.slug}`);

	return { event: event, academicStatus, fieldsOfStudy };
};
