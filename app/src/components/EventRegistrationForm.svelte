<script lang="ts">
	import { type Tables } from "#lib/models.js";

	const {
		event,
		survey,
	}: {
		event: Tables<"community_events">;
		survey: Tables<"registration_questions">[];
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

	<h5 class="small">Contact</h5>

	<div class="field label border prefix">
		<i>badge</i>
		<input id="ff-name" name="name" type="text" required />
		<label for="ff-name">Full name</label>
	</div>

	<div class="field label border prefix">
		<i>mail</i>
		<input id="ff-mail" name="email" type="email" required />
		<label for="ff-mail">Email address</label>
		<output>Personal address recommended to receive reminder emails without blocking</output>
	</div>

	<h5 class="small">Event survey</h5>

	<div class="field label border prefix">
		<i>event</i>
		<input id="ff-event" type="text" disabled value={event.title} />
		<label for="ff-event">Event</label>
	</div>

	{#each survey as question}
		<div class="field label border prefix">
			<i>question_answer</i>
			<input
				id={`ff-question-${question.id}`}
				name={`question-${question.id}`}
				type="text"
				required={question.is_required}
			/>
			<label for={`ff-question-${question.id}`}>{question.question_text}</label>
		</div>
	{/each}

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
