<script lang="ts">
	import Banner from "#components/Banner.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let tickets = $derived(data.tickets.map((ticket) => ticket.textModulesData) || []);
</script>

<PageMetadata
	title="Manage Tickets"
	description="View and manage all event tickets in one place."
/>

<Banner
	title="Manage Your Event Tickets"
	description="Easily view and manage all your event tickets in one place."
/>

{#if tickets.length === 0}
	<p>No tickets found.</p>
{:else}
	<p>{tickets.length} tickets found.</p>
	<div class="grid">
		{#each tickets as ticket}
			<pre class="s12 m6">{JSON.stringify(ticket, null, 2)}</pre>
		{/each}
	</div>
{/if}
