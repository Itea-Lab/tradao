<script lang="ts">
	import { onMount, tick } from "svelte";

	let snackbarRef: HTMLElement | null;
	let message = $state("");
	let icon = $state("");

	onMount(() => {
		const handleSnackbar = async (event: Event) => {
			const next = (event as CustomEvent).detail;
			message = next.message;
			icon = next.icon;

			await tick();
			try {
				ui("#app-snackbar", next.duration);
			} catch (error) {
				if (!snackbarRef) return;
				snackbarRef.showPopover();
				setTimeout(snackbarRef.showPopover, next.duration);
			}
		};

		window.addEventListener("app-snackbar", handleSnackbar);

		return () => {
			window.removeEventListener("app-snackbar", handleSnackbar);
		};
	});
</script>

<div
	bind:this={snackbarRef}
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
