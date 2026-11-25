<script lang="ts">
	import type { RemoteFormField } from "$app/server";

	const {
		id,
		icon,
		label,
		notes,
		field,
		defaultValue,
	}: {
		id: string;
		icon?: string;
		label: string;
		notes?: string;
		field: RemoteFormField<string>;
		defaultValue?: string;
	} = $props();
</script>

<div class="field label border prefix">
	<i>{icon || "question_answer"}</i>
	<input id={`ff-question-${id}`} type="text" {...field.as("text", defaultValue)} />
	<label for={`ff-question-${id}`}>{label}</label>
	{#if notes}<output>{notes}</output>{/if}
</div>
