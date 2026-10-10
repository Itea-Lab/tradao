import { errorResponse } from "$lib/utils";
import { eventCreationSchema } from "$lib/validation";
import type { RequestHandler } from "./$types";
import { type InferType, ValidationError } from "yup";
import { ulid } from "ulid";

type EventCreationProps = InferType<typeof eventCreationSchema>;

export const POST: RequestHandler = async (
	{ request, locals: { supabase } },
) => {
	const formData = await request.formData();

	// Hardcoded organiser ID (primary key on event_organisers table)
	formData.set("organiser_id", "fd6131ea-d7e0-474b-8ec0-f982d0a69dc8")

	// Extract form fields into an object for validation
	const body: Record<string, any> = {};
	for (const [key, value] of formData.entries()) {
		if (key !== "imageFile") body[key] = value;
	}

	// Get the image file separately
	const imageFile = formData.get("imageFile") as File | null;
	if (imageFile) body.imageFile = imageFile;

	try {
		const eventForm = eventCreationSchema.cast(body) as EventCreationProps;

		// Prepare event data for database
		let imageUrl = "";

		// Upload image to Supabase storage if provided
		if (eventForm.imageFile && eventForm.imageFile instanceof File) {
			const file = eventForm.imageFile;
			const fileExt = file.name.split(".").pop();
			const filePath = `event_thumbnails/${ulid()}.${fileExt}`;

			const { error: uploadError } = await supabase
				.storage
				.from("assets")
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: true,
				});

			if (uploadError) {
				return errorResponse(
					500,
					`Failed to upload image: ${uploadError.message}`,
				);
			}

			// Get the public URL for the uploaded image
			const { data: { publicUrl } } = supabase
				.storage
				.from("assets")
				.getPublicUrl(filePath);

			imageUrl = publicUrl;
		}

		// Prepare event data (exclude imageFile and add image URL)
		const { imageFile, ...eventData } = eventForm;
		const eventToInsert = { ...eventData, image: imageUrl };

		const { data, status, error } = await supabase
			.from("community_events")
			.upsert(eventToInsert)
			.select();

		if (error) return errorResponse(status, error.message);

		return Response.json({ event: data[0] }, { status });
	} catch (e) {
		if (e instanceof ValidationError) return errorResponse(400, e.errors);
		if (e instanceof Error) return errorResponse(400, e.message);

		return errorResponse(400, "Invalid request body");
	}
};
