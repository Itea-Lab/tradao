<script lang="ts">
	import type { TablesUpdate } from "#lib/models.js";
	import { issuesText, fileInfo } from "#lib/utils.js";
	import { createEvent, getEventQuestionTypes } from "#lib/remotes/events.remote.js";
	import { RemoteFields } from "./remote_fields";

	// Prop for editing existing event
	const {
		event,
	}: {
		event?: TablesUpdate<"community_events">;
		onSuccess: () => void;
	} = $props();

	/** Store multiple survey questions */
	let questionRows = $state([{}]);
	let isSubmitting = $state(false);

	const {
		title,
		start_time,
		end_time,
		location,
		category,
		thumbnail,
		description: desc,
		survey,
	} = createEvent.fields;

	/** Add a new survey question row */
	function addQuestion() {
		questionRows.push({});
	}

	/** Remove a survey question row */
	function removeQuestion(index: number) {
		if (questionRows.length > 1) {
			questionRows.splice(index, 1);
		} else {
			// Remove entirely
			questionRows = [{}];
		}
	}
</script>

<form {...createEvent} enctype="multipart/form-data">
	<h5 class="small">1. Basic details</h5>

	<div class={["field label border prefix", title.issues() && "invalid"]}>
		<i>title</i>
		<input id="ff-title" {...title.as("text", event?.title)} />
		<label for="ff-title">Title</label>
		{#if title.issues()}
			<output class="invalid">{issuesText(title.issues())}</output>
		{/if}
	</div>

	<RemoteFields.LocalDatetime id="ff-start" label="Start Time" field={start_time} />
	<RemoteFields.LocalDatetime id="ff-end" label="End Time" field={end_time} />

	<div class={["field label border prefix suffix", category.issues() && "invalid"]}>
		<i>category</i>
		<select id="ff-category" {...category.as("select", event?.category)}>
			<option value="">Select a category</option>
			<option value="Conference">Conference</option>
			<option value="Meetup">Meetup</option>
			<option value="Pitching">Pitching</option>
			<option value="Public Talkshow">Public Talkshow</option>
			<option value="Workshop">Workshop</option>
		</select>
		<label for="ff-category">Category</label>
		<i>arrow_drop_down</i>
		{#if category.issues()}
			<output class="invalid">{issuesText(category.issues())}</output>
		{/if}
	</div>

	<h5 class="small">2. Thumbnail image</h5>

	<div class="row">
		<button type="button" class="border">
			<i>image</i>
			<span>Upload Thumbnail</span>
			<input
				id="ff-thumbnail"
				accept="image/png,image/jpeg,image/webp"
				{...thumbnail.as("file")}
			/>
		</button>
		<p>{fileInfo("PNG/JPEG/WebP, 5MB max.", thumbnail.value())}</p>
	</div>

	<h5 class="small">3. Optional details</h5>

	<div class={["field label border prefix", location.issues() && "invalid"]}>
		<i>location_on</i>
		<input id="ff-location" {...location.as("text", event?.location ?? "")} />
		<label for="ff-location">Location</label>
		<span class="helper"> Defaults to Swinburne A35 building </span>
		{#if location.issues()}
			<output class="invalid">{issuesText(location.issues())}</output>
		{/if}
	</div>

	<div class={["field textarea label border prefix", desc.issues() && "invalid"]}>
		<i>description</i>
		<textarea
			id="ff-description"
			rows="10"
			{...desc.as("text", event?.description ?? "")}></textarea>
		<label for="ff-description">Event Description</label>
		{#if desc.issues()}
			<output class="invalid">{issuesText(desc.issues())}</output>
		{/if}
	</div>

	<h5 class="small">3. Survey questions</h5>

	{#each questionRows as _, i}
		<div class="grid">
			<div
				class={[
					"field label border prefix s12 m7",
					survey[i].question.issues() && "invalid",
				]}
			>
				<i>chat_info</i>
				<input id={`survey-question-${i}`} {...survey[i].question.as("text")} />
				<label for={`survey-question-${i}`}>Question {i + 1}</label>
			</div>

			<div
				class={[
					"field label border prefix s12 m4",
					survey[i].type.issues() && "invalid",
				]}
			>
				<i>data_object</i>
				<select id={`survey-type-${i}`} {...survey[i].type.as("select")}>
					<option value="">Pick one</option>
					{#each await getEventQuestionTypes() as type}
						<option value={type.slug}>{type.description}</option>
					{/each}
				</select>
				<label for={`survey-type-${i}`}>Type</label>
			</div>

			<button type="button" class="border s12 m1" onclick={() => removeQuestion(i)}>
				<i>close</i>
			</button>
		</div>
	{/each}

	<div class="space"></div>

	<button type="button" class="border" onclick={addQuestion}>
		<i>add</i> Add Question
	</button>

	<div class="medium-space"></div>
	<button type="submit" class="responsive" disabled={isSubmitting}>
		Create Event
	</button>
</form>
