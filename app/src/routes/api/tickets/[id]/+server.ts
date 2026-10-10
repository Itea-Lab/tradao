import type { RequestHandler } from "./$types";
import { errorResponse } from "$lib/utils";

export const GET: RequestHandler = async ({ locals: { supabase }, params }) => {
	const { id } = params;

	const { data, error } = await supabase
		.from("event_tickets")
		.select("*")
		.eq("id", id)
		.single();

	if (data && !error) return Response.json(data);

	console.error(error);
	switch (error.code) {
		case "22P02":
			return errorResponse(400, "Invalid ticket ID format");
		case "PGRST116":
			return errorResponse(404, "Ticket not found");
		default:
			return errorResponse(500, "Internal Server Error");
	}
};
