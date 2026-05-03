<script lang="ts">
	import Banner from "$components/Banner.svelte";
	import LoginForm from "$components/LoginForm.svelte";
	import PageMetadata from "$components/PageMetadata.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let redirectTo = $derived.by(() => {
		if (!data.url) return undefined;
		const url = new URL(data.url);
		return url.searchParams.get("redirectTo") || undefined;
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
	<LoginForm {redirectTo} />
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
