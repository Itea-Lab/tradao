<script lang="ts">
	import { type Tables } from "#lib/models.js";

	const {
		event,
		academicStatus,
		fieldsOfStudy,
	}: {
		event: Tables<"community_events">;
		academicStatus: Tables<"academic_status">[];
		fieldsOfStudy: Tables<"fields_of_study">[];
	} = $props();

	let isRegistering = $state(false);
	let errors = $state<string[]>([]);

	async function handleFormSubmission(e: Event) {
		isRegistering = true;
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		formData.append("eventID", event.id);

		const response = await fetch("/api/tickets", {
			method: "POST",
			body: formData,
		});

		switch (response.status) {
			case 400: {
				// 4xx errors
				const data = await response.json();
				errors = data.error;
				isRegistering = false;
				break;
			}

			case 500: {
				// 5xx errors
				errors = [
					"Something went wrong on our end. Please try again later.",
				];
				isRegistering = false;
				break;
			}

			case 200: {
				// ticketID
				const data = await response.json();
				const ticketID = data.ticketID;
				globalThis.location.href = `/tickets/${ticketID}`;
				break;
			}

			default: {
				// Unexpected status code
				errors = ["Unexpected error. Please try again later."];
				isRegistering = false;
			}
		}
	}
</script>

<form method="POST" class="mt-2" onsubmit={handleFormSubmission} noValidate>
	<datalist id="majors">
		<option value="Data Science">Data Science</option>
		<option value="Software Development">Software Development</option>
		<option value="Artificial Intelligence">Artificial Intelligence</option>
		<option value="Internet of Things">Internet of Things</option>
		<option value="Cyber Security">Cyber Security</option>
	</datalist>

	<div class="field label border prefix">
		<i>badge</i>
		<input id="ff-name" name="name" type="text" disabled value={event.title} />
		<label for="ff-name">Event</label>
	</div>

	<div class="field label border prefix">
		<i>badge</i>
		<input id="ff-name" name="name" type="text" required />
		<label for="ff-name">Full name</label>
	</div>

	<div class="field label border prefix">
		<i>mail</i>
		<input id="ff-mail" name="email" type="email" required />
		<label for="ff-mail">Email address</label>
	</div>

	<div class="field label border prefix suffix">
		<i>school</i>
		<select id="ff-year" name="year" required>
			<option value="">Select Academic Year</option>
			{#each academicStatus as year}
				<option value={year.id}>{year.label}</option>
			{/each}
		</select>
		<label for="ff-year">Academic Year</label>
		<i>arrow_drop_down</i>
	</div>

	<div class="field label border prefix suffix">
		<i>book</i>
		<select id="ff-field" name="field" required>
			<option value="">Select Field of Study</option>
			{#each fieldsOfStudy as field}
				<option value={field.id}>{field.label}</option>
			{/each}
		</select>
		<label for="ff-field">Field of Study</label>
		<i>arrow_drop_down</i>
	</div>

	<div class="field label border prefix">
		<i>local_library</i>
		<input id="ff-major" name="major" type="text" list="majors" required />
		<label for="ff-major">Major</label>
	</div>

	<div class="space"></div>

	<label for="ff-confm" class="checkbox">
		<input id="ff-confm" name="confirm" type="checkbox" required />{" "}
		<span>I confirm my participation in the event</span>
	</label>

	<div class="space"></div>

	{#if errors.length > 0}
		<section class="error small-padding">
			<ul>
				{#each errors as error}
					<li>{error}</li>
				{/each}
			</ul>
		</section>
		<div class="space"></div>
	{/if}

	<button type="submit" class="button" disabled={isRegistering}>
		Submit
	</button>
</form>
