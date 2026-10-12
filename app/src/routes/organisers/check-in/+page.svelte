<script lang="ts">
	import Banner from "#components/Banner.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import TicketScanner from "#components/TicketScanner.svelte";
</script>

<PageMetadata
	title="Check Ticket"
	description="Manage event check-ins with our efficient ticket scanning system."
/>

<Banner title="Validate your participants' ticket" />

<TicketScanner />
