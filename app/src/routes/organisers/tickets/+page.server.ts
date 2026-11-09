import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const { data: tickets, error: ticketsError } = await supabase
		.from("event_tickets")
		.select(`
			*,
			event: community_events(*),
			survey: registration_answers(
				*,
				question:registration_questions(*)
			)
		`)
		.order("created_at", { ascending: false });

	if (ticketsError) {
		console.error(ticketsError);
		return { tickets: [] };
	}

	return { tickets: tickets || [] };
}) satisfies PageServerLoad;
