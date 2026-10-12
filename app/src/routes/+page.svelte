<script lang="ts">
	import PageMetadata from '#components/PageMetadata.svelte';
	import Banner from '#components/Banner.svelte';
	import EventsFeed from '#components/EventsFeed.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PageMetadata
	title="Browse the latest lab events!"
	description="Check out the latest workshops, conferences, public talks and discussions in ITea Lab!"
	keywords="ITea Lab, Tradao, Events, Workshops, Conferences, Public Talks, Discussions, Technology, Innovation, Community, Vietnam"
/>

<Banner
	title={`Browse ITea\u00A0Lab's latest events!`}
	description="Check out the latest workshops, public talks and discussions at ITea Lab!"
/>

<EventsFeed events={data.events} />
