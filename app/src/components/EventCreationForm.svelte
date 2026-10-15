<script lang="ts">
	import type { TablesUpdate } from "#lib/models.js";
	import { onMount } from "svelte";

	// Prop for editing existing event
	const {
		event,
		onSuccess,
	}: {
		event?: TablesUpdate<"community_events">;
		onSuccess: () => void
	} = $props();

	let isSubmitting = $state(false);
	let errors = $state<string[]>([]);
	let fileInfo = $state("");

	async function handleSubmission(event: Event) {
		isSubmitting = true;
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const response = await fetch("/api/events", {
			method: "POST",
			body: formData,
		});

		switch (response.status) {
			case 400: {
				// 4xx errors
				const data = await response.json();
				errors = data.errors;
				isSubmitting = false;
				break;
			}

			case 500: {
				// 5xx errors
				errors = ["Something went wrong on our end. Please try again later."];
				isSubmitting = false;
				break;
			}

			case 200: {
				onSuccess();
				isSubmitting = false;
				break;
			}

			default:
				// Unexpected status code
				errors = ["Unexpected error. Please try again later."];
				break;
		}
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const sizeInKB = (file.size / 1024).toFixed(2);
			fileInfo = `${file.name} (${sizeInKB} KB)`;
		} else {
			fileInfo = "";
		}
	}

	onMount(() => {
		if (event) {
			// Pre-fill form fields with existing event data
			const form = document.querySelector("form") as HTMLFormElement;
			if (form) {
				(form.elements.namedItem("title") as HTMLInputElement).value =
					event.title || "";
				(form.elements.namedItem("start_time") as HTMLInputElement).value =
					event.start_time || "";
				(form.elements.namedItem("end_time") as HTMLInputElement).value =
					event.end_time || "";
				(form.elements.namedItem("location") as HTMLInputElement).value =
					event.location || "";
				(form.elements.namedItem("category") as HTMLSelectElement).value =
					event.category || "";
				(form.elements.namedItem("description") as HTMLTextAreaElement).value =
					event.description || "";
			}
		}
	});
</script>

<form method="POST" noValidate onsubmit={handleSubmission}>
	{@render Step1()}

	{#if errors.length > 0}
		<section class="error">
			<h5>Oops! There were some problems with registering!</h5>
			<ul>
				{#each errors as error}
					<li>{error}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div class="medium-space"></div>
	<button type="submit" class="responsive" disabled={isSubmitting}>
		Create Event
	</button>
</form>

{#snippet Step1()}
	<div class="row">
		<button type="button">
			<i>image</i>
			<span>Image Thumbnail</span>
			<input
				type="file"
				id="image"
				name="imageFile"
				accept="image/png,image/jpeg,image/webp"
				required
				onchange={handleFileChange}
			/>
		</button>
		<p>{fileInfo}</p>
	</div>

	<div class="field label border prefix">
		<i>title</i>
		<input type="text" id="title" name="title" required />
		<label for="title">Title</label>
	</div>

	<div class="field label border prefix">
		<i>event</i>
		<input type="datetime-local" id="start_time" name="start_time" required />
		<label for="start_time">Start Time</label>
	</div>

	<div class="field label border prefix">
		<i>event</i>
		<input type="datetime-local" id="end_time" name="end_time" required />
		<label for="end_time">End Time</label>
	</div>

	<div class="field label border prefix">
		<i>location_on</i>
		<input type="text" id="location" name="location" required />
		<label for="location">Location</label>
		<span class="helper">
			Can simply be room name, which defaults to Swinburne A35 building
		</span>
	</div>

	<div class="field label border prefix suffix">
		<i>category</i>
		<select id="category" name="category" required>
			<option value="">Select a category</option>
			<option value="Conference">Conference</option>
			<option value="Meetup">Meetup</option>
			<option value="Pitching">Pitching</option>
			<option value="Public Talkshow">Public Talkshow</option>
			<option value="Workshop">Workshop</option>
		</select>
		<label for="category">Category</label>
		<i>arrow_drop_down</i>
	</div>

	<div class="field textarea label border">
		<textarea id="description" name="description" rows="10"></textarea>
		<label for="description">Event Description</label>
	</div>
{/snippet}
