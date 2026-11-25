<script lang="ts">
	import Banner from "#components/Banner.svelte";
	import LoginForm from "#components/LoginForm.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { onMount } from "svelte";

	let { data }: { data: PageData } = $props();
	const redirectTo = $state(page.url.searchParams.get("redirectTo"));

	function onLoggedIn() {
		goto(redirectTo || "/organisers", { replace: true });
	}

	onMount(() => {
		if (data.claims) onLoggedIn();
	});
</script>

<PageMetadata
	title="Login as Event Organiser"
	description="Access the management dashboard to manage events and tickets"
	keywords="ITea Lab, Tradao, Login, Management Dashboard, Events, Tickets, Technology, Innovation, Community, Vietnam"
/>

<div id="centre">
	<Banner
		title="Login as Event Organiser"
		description="Access the management dashboard to manage events and tickets"
	/>

	<LoginForm onSuccess={onLoggedIn} />
</div>

<style>
	#centre {
		height: 80vh;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 600px) {
		#centre {
			height: auto;
		}
	}
</style>
