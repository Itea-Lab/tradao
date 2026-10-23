import yup from "yup";
import { command, form } from "$app/server";
import { createSupabaseClient } from "#lib/supabase.js";
import { error, redirect } from "@sveltejs/kit";

const client = createSupabaseClient();

/**
 * Remote function to register an event on the frontend.
 *
 * This function validates the input data, creates a ticket in the "event_tickets" table,
 * and stores the survey answers in the "registration_answers" table.
 * Successful registration will redirect the user to the ticket page.
 */
export const registerEvent = form(
	yup.object({
		// Event ID
		eventID: yup
			.string()
			.trim().required('Event ID is required')
			.uuid('Event ID must be a valid UUID'),

		// Participant Name
		name: yup
			.string()
			.trim().required('Name is required')
			.matches(/^[\p{L}\s-]+$/u, 'Name must contain only letters, spaces, and hyphens'),

		// Participant Email
		email: yup
			.string()
			.trim().required('Email is required')
			.email(),

		// Survey Answers
		surveyAnswers: yup
			.array()
			.required('Survey answers are required')
			.of(
				yup.object({
					questionID: yup.string().uuid().required('Question ID is required'),
					answer: yup.string().required('Answer is required'),
				}).required()
			),
	}),
	async ({ eventID, name, email, surveyAnswers }) => {
		console.debug(`Registering for event ${eventID} with name: ${name}, email: ${email}`);
		surveyAnswers.forEach((answer) => {
			console.debug(`Answer for question ${answer.questionID}: ${answer.answer}`);
		});

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
	}
);
