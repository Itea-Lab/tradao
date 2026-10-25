import * as yup from 'yup';

export const eventID = yup
	.string()
	.trim().required('Event ID is required')
	.uuid('Event ID must be a valid UUID');

/** Accommodate datetime-local HTML input format */
export const localDateTime = yup.string()
	.trim().required()
	.matches(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
		({ value }) => `${value} is not a valid date-time`
	);

export const participantName = yup.string()
	.trim().required('Name is required')
	.matches(/^[\p{L}\s-]+$/u, 'Name must contain only letters, spaces, and hyphens');

export const participantEmail = yup.string()
	.trim().required('Email is required')
	.email();

export const thumbnail = yup.mixed<File>()
	.default(new File([], "", { type: "image/jpeg" }))
	.test('file', 'Image file must be a file', (value) => value instanceof File)
	.test('size', 'File must be 5 MB or smaller', (value) =>
		value instanceof File ? value.size <= 5 * 1024 * 1024 : true
	)
	.test('type', 'Only images are allowed', (value) =>
		value instanceof File ? value.type.startsWith('image/') : true
	);
export const eventRegistrationSchema = yup.object({
	eventID: eventID,
	name: participantName,
	email: participantEmail,

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
});

/**
 * Yup validation schema for event creation form.
 */
export const eventCreationSchema = yup.object({
	title: yup.string()
		.trim()
		.required('Event title is required'),

	start_time: localDateTime,
	end_time: localDateTime,

	location: yup.string()
		.default('A35 Bach Dang, Tan Binh Ward, Ho Chi Minh City, Vietnam'),

	category: yup.string()
		.trim()
		.required('Event category is required'),

	thumbnail: thumbnail,

	description: yup.string()
		.trim()
		.default(''),

	survey: yup
		.array()
		.of(
			yup.object({
				question: yup.string()
					.trim().required('Survey question is required'),

				type: yup
					.string()
					.oneOf(["text", "select", "boolean", "number", "date", "file"])
					.required('Survey question type is required'),

				options: yup.array().of(
					yup.string()
						.trim()
						.required('Option text is required')
				)
			})
		)
		.default([])
});
