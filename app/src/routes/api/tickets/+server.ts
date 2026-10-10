import { errorResponse } from "$lib/utils";
import { eventRegistrationSchema } from "$lib/validation";
import type { RequestHandler } from "./$types";
import * as yup from "yup";

interface RegistrationFormProps {
	eventID: string;
	name: string;
	email: string;
	year: string;
	field: string;
	major: string;
	confirm: boolean;
}

function formToObject(form: FormData): RegistrationFormProps {
	return {
		eventID: (form.get("eventID") as string) || "",
		name: (form.get("name") as string) || "",
		email: (form.get("email") as string) || "",
		year: (form.get("year") as string) || "",
		field: (form.get("field") as string) || "",
		major: (form.get("major") as string) || "",
		confirm: form.get("confirm") === "on",
	};
}

export const POST: RequestHandler = async (
	{ request, locals: { supabase } },
) => {
	const form = await request.formData();
	const registrationData = formToObject(form);

	try {
		await eventRegistrationSchema.validate(registrationData, {
			abortEarly: false,
		});
	} catch (e) {
		if (e instanceof yup.ValidationError) {
			return errorResponse(400, e.errors);
		}
	}

	const { data: ticket, error } = await supabase.from("event_tickets").insert(
		[{
			event_id: registrationData.eventID,
			name: registrationData.name,
			email: registrationData.email,
			academic_year: registrationData.year,
			field_of_study: registrationData.field,
			major: registrationData.major,
			participate: registrationData.confirm,
		}],
	).select();

	if (error) return errorResponse(500, `Database error: ${error.message}`);
	if (!ticket) {
		return errorResponse(
			500,
			"Database error: Ticket cannot be identified",
		);
	}

	return Response.json({ ticketID: ticket[0].id }, { status: 200 });
};
