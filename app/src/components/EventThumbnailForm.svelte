<script lang="ts">
	import { updateEventThumbnail } from "#lib/remotes/events.remote.js";
	import type { Tables } from "#lib/models.js";
	import { showSnackbar } from "#lib/snackbar.js";
	import { issuesText } from "#lib/utils.js";
	import { onMount } from "svelte";

	let newDisplay: string | null = $state(null);
	const { event }: { event: Tables<"community_events"> } = $props();
	const { eventID, thumbnail } = updateEventThumbnail.fields;

	const reader = new FileReader();
	reader.onload = (e) => {
		newDisplay = e.target?.result as string;
	};

	function renderImage() {
		reader.readAsDataURL(thumbnail.value() as File);
	}

	onMount(() => (newDisplay = null));
</script>

<form
	class="grid"
	enctype="multipart/form-data"
	{...updateEventThumbnail.enhance(async (form) => {
		try {
			if (await form.submit()) {
				if (!form.result?.success) throw new Error(form.result?.message);
				form.element.reset();
				newDisplay = null;
				showSnackbar(`Successfully updated event thumbnail: ${event.title}`);
			} else {
				console.group("Form submission failed");
				form.fields.allIssues()?.forEach((issue) => {
					console.error(issue.message);
				});
				console.groupEnd();
			}
		} catch (e) {
			console.error(e);
			showSnackbar(e as string, "error");
		}
	})}
>
	<input {...eventID.as("text", event.id)} readonly hidden />
	<h6 class="s12 small">{event.title}</h6>

	<div class={["s12 m9 field label prefix border"]}>
		<i>attach_file</i>

		<input
			{...thumbnail.as("file")}
			id="thumbnail"
			accept="image/*"
			onchange={renderImage}
		/>

		<input type="text" />
		<label for="thumbnail"> Upload new image </label>
		<output>max. 5MB, JPG/PNG/WEBP</output>

		{#if thumbnail.issues()}
			<output class="invalid">
				{issuesText(thumbnail.issues())}
			</output>
		{/if}
	</div>

	<button type="submit" class="s12 m3 large">
		<i>save</i>
		Save
	</button>
</form>

<div class="grid">
	<div class="s12 m6">
		<h6>Current</h6>
		<div class="space"></div>
		<img class="responsive" src={event.image} alt={`Thumbnail for ${event.title}`} />
	</div>

	<div class="s12 m6">
		<h6>New</h6>
		<div class="space"></div>
		<img
			class="responsive"
			src={newDisplay ?? event.image}
			alt={newDisplay ? "New thumbnail preview" : "No new thumbnail selected"}
		/>
	</div>
</div>
