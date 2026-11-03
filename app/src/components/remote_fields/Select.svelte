<script lang="ts">
	import type { RemoteFormField } from "$app/server";

	const {
		id,
		icon,
		label,
		notes,
		field,
		options,
	}: {
		id: string;
		icon?: string;
		label: string;
		notes?: string;
		field: RemoteFormField<string>;
		options: { value: string; label: string }[];
	} = $props();
</script>

<div class="field label border prefix">
	<i>{icon || "question_answer"}</i>
	<select id={`ff-question-${id}`} {...field.as("select")}>
		<option value="">Select an option</option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<label for={`ff-question-${id}`}>{label}</label>
	{#if notes}<output>{notes}</output>{/if}
</div>
