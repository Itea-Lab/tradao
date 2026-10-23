<script lang="ts">
	import { registerEvent } from "#lib/remotes/events.remote.js";
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

	const { name, email, eventID, surveyAnswers } = registerEvent.fields;
</script>

<form {...registerEvent}>
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
		<input id="ff-name" {...name.as("text")} />
		<label for="ff-name">Full name</label>
	</div>

	<div class="field label border prefix">
		<i>mail</i>
		<input id="ff-mail" {...email.as("email")} />
		<label for="ff-mail">Email address</label>
		<output
			>Personal address recommended to receive reminder emails without blocking</output
		>
	</div>

	<h5 class="small">Event survey</h5>

	<input type="text" {...eventID.as("text", event.id)} hidden />

	<div class="field label border prefix">
		<i>event</i>
		<input id="ff-event" value={event.title} disabled />
		<label for="ff-event">Event</label>
	</div>

	{#each survey as question, index}
		<!-- Question ID (hidden) -->
		<input
			type="text"
			{...surveyAnswers[index].questionID.as("text", question.id)}
			hidden
		/>

		<!-- Question answer -->
		<div class="field label border prefix">
			<i>question_answer</i>
			<input
				id={`ff-question-${question.id}`}
				type="text"
				{...surveyAnswers[index].answer.as("text")}
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

	<button type="submit" class="button" disabled={isRegistering}>Submit</button>
</form>
