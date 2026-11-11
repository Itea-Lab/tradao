<script lang="ts">
	import { onMount, tick } from "svelte";

	let message = $state("");
	let icon = $state("");

	onMount(() => {
		const handleSnackbar = async (event: Event) => {
			const next = (event as CustomEvent).detail;
			message = next.message;
			icon = next.icon;

			await tick();
			ui("#app-snackbar", next.duration);
		};

		window.addEventListener("app-snackbar", handleSnackbar);

		return () => {
			window.removeEventListener("app-snackbar", handleSnackbar);
		};
	});
</script>

<div
	id="app-snackbar"
	aria-live="polite"
	role="status"
	class={[
		"snackbar",
		icon === "info" && "primary active",
		icon === "error" && "error active",
	]}
>
	<i>{icon}</i>
	<span>{message}</span>
</div>
