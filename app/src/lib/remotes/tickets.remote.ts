import { error, redirect } from "@sveltejs/kit";
import { query, getRequestEvent, form } from "$app/server";

import { eventID, eventRegistrationSchema, ticketID } from "#lib/validation.js";

/**
 * Remote function to query all tickets.
 * To query tickets of a specific event, use {@link getEventTickets}
 */
export const getTicketsWithDetails = query(async () => {
	const sb = getRequestEvent().locals.supabase;
	const { data: participants, error: queryError } = await sb
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

	if (queryError) error(500, queryError.message);
	return participants;
});

/**
 * Remote function to query tickets of a specific event.
 */
export const getEventTickets = query(eventID, async (eventID) => {
	const sb = getRequestEvent().locals.supabase;
	const { data: tickets, error: queryError } = await sb
		.from("event_tickets")
		.select("*")
		.eq("event_id", eventID);

	if (queryError) error(500, queryError.message);
	return tickets;
});

/**
 * Remote function to query a single ticket
 * with other details (event, survey).
 */
export const getDetailedTicket = query(ticketID, async (ticketID) => {
	const sb = getRequestEvent().locals.supabase;
	const { data: ticket, error: ticketError } = await sb.from("event_tickets")
		.select(`
			*,
			survey: registration_answers (*),
			event: community_events (*, organiser: event_organisers (name))
		`)
		.eq("id", ticketID)
		.single();

	if (ticketError) error(500, `Failed to fetch ticket: ${ticketError.message}`);
	if (!ticket) error(404, `Ticket not found.`);

	return ticket;
});

/**
 * Remote function to query a single ticket based on its ID
 */
export const getTicket = query(ticketID, async (id) => {
	const sb = getRequestEvent().locals.supabase;
	const { data: ticket, error: queryError } = await sb
		.from("event_tickets")
		.select("*")
		.eq("id", id)
		.limit(1)
		.single();

	if (queryError) error(500, queryError.message);
	if (!ticket) error(404, `Ticket with ID ${ticketID} not found`);
	return ticket;
});

/**
 * Remote function to get the tickets count of events
 */
export const getTicketsCount = query.batch(eventID, async (eventIDs) => {
	const sb = getRequestEvent().locals.supabase;
	const { data: events, error: queryError } = await sb.from("community_events")
		.select("id, tickets: event_tickets(count)")
		.in("id", eventIDs);

	if (queryError) error(500, queryError.message);

	const lookup = new Map<string, number>();
	for (const { id, tickets } of events) {
		lookup.set(id, tickets[0]?.count ?? 0);
	}

	return (eventID) => lookup.get(eventID) ?? 0;
});

/**
 * Remote function to register an event on the frontend.
 *
 * This function validates the input data, creates a ticket in the "event_tickets" table,
 * and stores the survey answers in the "registration_answers" table.
 * Successful registration will redirect the user to the ticket page.
 */
export const registerEvent = form(eventRegistrationSchema, async ({ eventID, name, email, surveyAnswers }) => {
	// All users can register events i.e. anon
	const sb = getRequestEvent().locals.supabase;

	// Upload the base ticket
	const { data: ticket, error: ticketError } = await sb.from("event_tickets")
		.insert([{ event_id: eventID, name, email }])
		.select().single();

	if (ticketError) error(500, `Failed to create ticket: ${ticketError.message}`);
	if (!ticket) error(500, 'Cannot identify the created ticket. Please contact support.');

	// Upload the survey answers
	if (!surveyAnswers || surveyAnswers.length === 0) {
		// No survey answers provided, skip this step
		redirect(303, `/tickets/${ticket.id}`);
	}

	const { error: surveyError } = await sb.from("registration_answers").insert(
		surveyAnswers.map((answer) => ({
			ticket_id: ticket.id,
			question_id: answer.questionID,
			answer_text: answer.answer,
		}))
	).select();

	if (surveyError) error(500, `Failed to create survey answers: ${surveyError.message}`);
	redirect(303, `/tickets/${ticket.id}`);
});
