<script lang="ts">
	import type { TablesUpdate } from "#lib/models.js";
	import { issuesText } from "#lib/utils.js";
	import { createEvent, getEventQuestionTypes } from "#lib/remotes/events.remote.js";
	import { RemoteFields } from "./remote_fields";
	import { showSnackbar } from "#lib/utils.js";

	// Prop for editing existing event
	const {
		event,
		onSuccess,
	}: {
		event?: TablesUpdate<"community_events">;
		onSuccess: () => void;
	} = $props();

	/** Store multiple survey questions */
	let questionRows = $state([{ question: "", type: "" }]);

	const {
		title,
		start_time,
		end_time,
		location,
		slug,
		category,
		description: desc,
		survey,
	} = createEvent.fields;

	/** Add a new survey question row */
	function addQuestion() {
		questionRows.push({ question: "", type: "" });
	}

	/** Remove a survey question row */
	function removeQuestion(index: number) {
		questionRows.splice(index, 1);
	}

	/**
	 * Convert the event title to kebab-case and set as slug.
	 * Skip if the title is empty.
	 */
	function generateEventSlug() {
		const titleValue = title.value();
		if (!titleValue) return;

		const kebabTitle = titleValue
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
		slug.set(kebabTitle);
	}
</script>

<form
	enctype="multipart/form-data"
	{...createEvent.enhance(async (form) => {
		try {
			if (await form.submit()) {
				if (!form.result?.success) throw new Error(form.result?.message);
				form.element.reset();
				showSnackbar(`Successfully created event: ${form.fields.title.value()}`);
				onSuccess();
			} else {
				console.group("Form submission failed");
				form.fields.allIssues()?.forEach((issue) => {
					console.warn(issue.message);
				});
				console.groupEnd();
			}
		} catch (e) {
			console.error(e);
			showSnackbar(e as string, "error");
		}
	})}
>
	<!-- MARK: Basic -->
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

	<!-- MARK: Optional -->
	<h5 class="small">2. Optional details</h5>

	<div class={["field label border prefix suffix", slug.issues() && "invalid"]}>
		<i>link</i>
		<input id="ff-slug" {...slug.as("text", event?.slug ?? "")} />
		<label for="ff-slug">Slug</label>
		<i
			role="button"
			tabindex="0"
			aria-label="Generate"
			onclick={generateEventSlug}
			onkeydown={generateEventSlug}>star</i
		>
		<span class="helper">Format: year-kebab-case-title</span>
		{#if slug.issues()}
			<output class="invalid">{issuesText(slug.issues())}</output>
		{/if}
	</div>

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
		<label for="ff-description">Description</label>
		{#if desc.issues()}
			<output class="invalid">{issuesText(desc.issues())}</output>
		{/if}
	</div>

	<!-- MARK: Survey -->
	<h5 class="small">3. Survey questions</h5>

	{#each questionRows as _, i}
		<div class="grid">
			<div
				class={[
					"field label border prefix s11",
					survey[i].type.issues() && "invalid",
				]}
			>
				<i>data_object</i>
				<select id={`survey-type-${i}`} {...survey[i].type.as("select")}>
					<option value="">Select a question type</option>
					{#each await getEventQuestionTypes() as type}
						<option value={type.slug}>{type.description}</option>
					{/each}
				</select>
				<label for={`survey-type-${i}`}>Question {i + 1} Type</label>
			</div>

			<div
				class={[
					"field label border prefix s11",
					survey[i].question.issues() && "invalid",
				]}
			>
				<i>chat_info</i>
				<input id={`survey-question-${i}`} {...survey[i].question.as("text")} />
				<label for={`survey-question-${i}`}>Question {i + 1}</label>
			</div>

			<button type="button" class="border s1" onclick={() => removeQuestion(i)}>
				<i>close</i>
			</button>
		</div>
	{/each}

	<div class="space"></div>

	<button type="button" class="border" onclick={addQuestion}>
		<i>add</i> Add Question
	</button>

	<div class="medium-space"></div>
	<button type="submit" class="responsive" disabled={!!createEvent.pending}>
		Create Event
	</button>
</form>
