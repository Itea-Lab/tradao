<script lang="ts">
	import type { RemoteFormField } from "$app/server";

	const {
		id,
		label,
		field: attr,
	}: {
		id: string;
		label: string;
		field: RemoteFormField<string>;
	} = $props();
</script>

<datalist id="majors">
	<option value="Data Science">Data Science</option>
	<option value="Software Development">Software Development</option>
	<option value="Artificial Intelligence">Artificial Intelligence</option>
	<option value="Internet of Things">Internet of Things</option>
	<option value="Cyber Security">Cyber Security</option>
</datalist>

<div class="field label border prefix">
	<i>local_library</i>
	<input id={`ff-question-${id}`} type="text" {...attr.as("text")} list="majors" />
	<label for={`ff-question-${id}`}>{label}</label>
</div>
