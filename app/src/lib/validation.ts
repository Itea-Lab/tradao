import { string, mixed, array, object } from "yup";

export const eventID = string()
	.trim()
	.required("Event ID is required")
	.uuid("Event ID must be a valid UUID");

export const ticketID = string()
	.trim()
	.required("Ticket ID is required")
	.uuid("Ticket ID must be a valid UUID");

/** Accommodate datetime-local HTML input format */
export const localDateTime = string()
	.trim()
	.required()
	.matches(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
		({ value }) => `${value} is not a valid date-time`,
	);

export const participantName = string()
	.trim()
	.required("Name is required")
	.matches(/^[\p{L}\s-]+$/u, "Name must contain only letters, spaces, and hyphens");

export const participantEmail = string().trim().required("Email is required").email();

export const thumbnail = mixed<File>()
	.default(new File([], "", { type: "image/jpeg" }))
	.test("file", "Image file must be a file", (value) => value instanceof File)
	.test("size", "File must be 5 MB or smaller", (value) =>
		value instanceof File ? value.size <= 5 * 1024 * 1024 : true,
	)
	.test("type", "Only images are allowed", (value) =>
		value instanceof File ? value.type.startsWith("image/") : true,
	);

export const loginSchema = object({
	email: string()
		.email("Email must be a valid email address")
		.trim()
		.required("Email is required"),

	_password: string()
		.min(6, "Password must be at least 6 characters")
		.trim()
		.required("Password is required"),
});

export const userProfileSchema = object({
	id: string().trim().required().uuid(),
	displayName: string().trim().default(""),
});

export const eventRegistrationSchema = object({
	eventID: eventID,
	name: participantName,
	email: participantEmail,

	// Survey Answers
	surveyAnswers: array()
		.default([])
		.of(
			object({
				questionID: string().uuid().required("Question ID is required"),
				answer: string().required("Answer is required"),
			}).required(),
		),
});

/**
 * Yup validation schema for event thumbnail upload form.
 */
export const eventThumbnailSchema = object({
	eventID: eventID,
	thumbnail: thumbnail,
});

/**
 * Yup validation schema for event creation form.
 */
export const eventCreationSchema = object({
	title: string().trim().required("Event title is required"),

	start_time: localDateTime,
	end_time: localDateTime,

	location: string().default("A35 Bach Dang, Tan Binh Ward, Ho Chi Minh City, Vietnam"),

	category: string().trim().required("Event category is required"),

	description: string().trim().default(""),

	slug: string().trim(),

	survey: array()
		.of(
			object({
				question: string().trim().required("Survey question is required"),

				type: string()
					.oneOf(["text", "select", "boolean", "number", "date", "file"])
					.required("Survey question type is required"),

				options: array().of(string().trim().required("Option text is required")),
			}),
		)
		.default([]),
});
