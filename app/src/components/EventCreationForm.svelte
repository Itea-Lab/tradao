<script lang="ts">
	import type { TablesUpdate } from "#lib/models.js";
	import { createEvent } from "#lib/remotes/events.remote.js";
	import type { RemoteFormIssue } from "$app/server";

	// Prop for editing existing event
	const {
		event,
	}: {
		event?: TablesUpdate<"community_events">;
		onSuccess: () => void;
	} = $props();

	let isSubmitting = $state(false);

	const {
		allIssues,
		title,
		start_time,
		end_time,
		location,
		category,
		thumbnail,
		description,
	} = createEvent.fields;

	/** Format form issues into a string for display */
	function issuesText(issues?: RemoteFormIssue[]) {
		if (!issues) return "";
		return issues.map((issue) => issue.message).join(", ");
	}

	function fileInfo(file?: File) {
		if (!file) return "PNG/JPEG/WebP, 5MB max.";
		return `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
	}
</script>

<form {...createEvent} enctype="multipart/form-data">
	<div class="row">
		<button type="button">
			<i>image</i>
			<span>Image Thumbnail</span>
			<input
				id="ff-thumbnail"
				accept="image/png,image/jpeg,image/webp"
				{...thumbnail.as("file")}
			/>
		</button>
		<p>{fileInfo(thumbnail.value())}</p>
	</div>

	<div class={["field", "label", "border", "prefix", title.issues() && "invalid"]}>
		<i>title</i>
		<input id="ff-title" {...title.as("text", event?.title)} />
		<label for="ff-title">Title</label>
		{#if title.issues()}
			<output class="invalid">{issuesText(title.issues())}</output>
		{/if}
	</div>

	<div class={["field", "label", "border", "prefix", start_time.issues() && "invalid"]}>
		<i>event</i>
		<input id="ff-start" {...start_time.as("datetime-local", event?.start_time)} />
		<label for="ff-start">Start Time</label>
		{#if start_time.issues()}
			<output class="invalid">{issuesText(start_time.issues())}</output>
		{/if}
	</div>

	<div class={["field", "label", "border", "prefix", end_time.issues() && "invalid"]}>
		<i>event</i>
		<input id="ff-end" {...end_time.as("datetime-local", event?.end_time)} />
		<label for="ff-end">End Time</label>
		{#if end_time.issues()}
			<output class="invalid">{issuesText(end_time.issues())}</output>
		{/if}
	</div>

	<div
		class={[
			"field",
			"label",
			"border",
			"prefix",
			"suffix",
			category.issues() && "invalid",
		]}
	>
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

	<div class={["field", "label", "border", "prefix", location.issues() && "invalid"]}>
		<i>location_on</i>
		<input id="ff-location" {...location.as("text", event?.location ?? "")} />
		<label for="ff-location">Location</label>
		<span class="helper"> Defaults to Swinburne A35 building </span>
		{#if location.issues()}
			<output class="invalid">{issuesText(location.issues())}</output>
		{/if}
	</div>

	<div
		class={[
			"field",
			"textarea",
			"label",
			"border",
			"prefix",
			description.issues() && "invalid",
		]}
	>
		<i>description</i>
		<textarea
			id="ff-description"
			rows="10"
			{...description.as("text", event?.description ?? "")}></textarea>
		<label for="ff-description">Event Description</label>
		{#if description.issues()}
			<output class="invalid">{issuesText(description.issues())}</output>
		{/if}
	</div>

	<div class="medium-space"></div>
	<button type="submit" class="responsive" disabled={isSubmitting}>
		Create Event
	</button>
</form>
