import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { supabase } }) => {
	const { data, error: dbError } = await supabase
		.from("tickets_with_event_details")
		.select("*")
		.eq("ticket_id", params.id)
		.limit(1)
		.single();

	if (dbError) throw dbError;
	if (!data) throw error(404, "Ticket not found");

	// Deprecate Google Wallet integration till further planning.
	// const classID = await createPassClass();
	// const passObject = await createPassObject(classID, data);
	// const saveURL = await getPassSaveUrl(passObject);

	return { ticket: data, saveURL: "https://example.com" };
}) satisfies PageServerLoad;
