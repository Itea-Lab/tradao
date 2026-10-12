<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { formatDate } from "#lib/utils.js";

	let time = $state(new Date());
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			time = new Date();
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<span>
	<i class="prefix-icon">schedule</i>
	<span data-testid="time">
		{formatDate(time, { hour: "2-digit", minute: "2-digit", hour12: false })}
	</span>
	&bull;
	<span data-testid="date">
		{formatDate(time, { weekday: "short", day: "2-digit", month: "short" })}
	</span>
</span>
