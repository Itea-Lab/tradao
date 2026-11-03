import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const { data: tickets, error: ticketsError } = await supabase
		.from("tickets_with_event_details")
		.select("*, survey:registration_answers(*, question:registration_questions(*))")
		.order("created_at", { ascending: false });

	if (ticketsError) {
		console.error(ticketsError);
		return { tickets: [] };
	}

	return { tickets: tickets || [] };
}) satisfies PageServerLoad;
