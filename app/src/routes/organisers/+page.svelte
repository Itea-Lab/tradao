<script lang="ts">
	import PageMetadata from "$components/PageMetadata.svelte";
	import Banner from "$components/Banner.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let username = $derived(data.user?.email ?? "User");
</script>

<PageMetadata
	title="Management Home"
	description="Manage ITea Lab events and Tradao tickets here"
	keywords="ITea Lab, Tradao, Management Dashboard, Events, Tickets, Technology, Innovation, Community, Vietnam"
/>

<Banner
	title={`Welcome back, ${username}`}
	description="Manage ITea Lab events and Tradao tickets here"
/>

<section style="max-width: 90ch; margin: auto">
	<a class="block" href="/organisers/events">
		<article>
			<h2><i class="large">event</i> Manage Events</h2>
			<div class="row right-align">
				<i>arrow_forward</i>
			</div>
		</article>
	</a>

	<div class="space"></div>

	<a class="block" href="/organisers/tickets">
		<article>
			<h2><i class="large">local_activity</i> Manage Tickets</h2>
			<div class="row right-align">
				<i>arrow_forward</i>
			</div>
		</article>
	</a>

	<div class="space"></div>

	<a class="block" href="/organisers/check-in">
		<article>
			<h2><i class="large">camera</i> Check-in Tickets</h2>
			<div class="row right-align">
				<i>arrow_forward</i>
			</div>
		</article>
	</a>

	<div class="space"></div>
</section>

<style>
	article h2 {
		font-size: 2em;
	}
</style>
