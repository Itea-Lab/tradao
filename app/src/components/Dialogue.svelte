<script lang="ts">
	import { fade } from "svelte/transition";

	let { children, onClose }: { children: any; onClose: () => void } = $props();

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") onClose();
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="overlay blur active"></div>

<dialog transition:fade open style="min-width: 50%;">
	{@render children()}
</dialog>
