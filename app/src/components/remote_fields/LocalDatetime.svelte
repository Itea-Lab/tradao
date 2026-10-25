<script lang="ts">
	import { issuesText } from "#lib/utils.js";
	import type { RemoteFormField } from "$app/server";

	const {
		id,
		icon,
		label,
		notes,
		field,
	}: {
		id: string;
		icon?: string;
		label: string;
		notes?: string;
		field: RemoteFormField<string>;
	} = $props();
</script>

<div class={["field label border prefix", field.issues() && "invalid"]}>
	<i>{icon || "question_answer"}</i>
	<input {id} {...field.as("datetime-local")} />
	<label for={id}>{label}</label>
	{#if notes}<output>{notes}</output>{/if}
	{#if field.issues()}
		<output class="invalid">{issuesText(field.issues())}</output>
	{/if}
</div>
