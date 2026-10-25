<script lang="ts">
	import { registerEvent } from "#lib/remotes/events.remote.js";
	import { type Tables } from "#lib/models.js";
	import { RemoteFields } from "./remote_fields";

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
	<h5 class="small">Contact information</h5>

	<RemoteFields.Text id="ff-name" icon="badge" label="Full name" field={name} />

	<RemoteFields.Text
		id="ff-mail"
		icon="mail"
		label="Email address"
		field={email}
		notes="Personal address recommended to receive reminder emails without blocking"
	/>

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
		{#if question.question_type === "major"}
			<RemoteFields.Major
				id={question.id}
				label={question.question_text}
				field={surveyAnswers[index].answer}
			/>
		{:else}
			<RemoteFields.Text
				id={question.id}
				label={question.question_text}
				field={surveyAnswers[index].answer}
			/>
		{/if}
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

	<button type="submit" class="button responsive" disabled={isRegistering}>
		Let's go!
	</button>
</form>
