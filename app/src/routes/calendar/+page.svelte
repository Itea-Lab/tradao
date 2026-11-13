<script lang="ts">
	import { onMount } from "svelte";
	import { Calendar, type CalendarEvent, WillowDark } from "@svar-ui/svelte-calendar";
	import { getEvents } from "#lib/remotes/events.remote.js";
	import PageMetadata from "#components/PageMetadata.svelte";
	import Banner from "#components/Banner.svelte";

	let events = $state<CalendarEvent[]>([]);

	onMount(async () => {
		const data = await getEvents();
		events = data.map((e) => ({
			id: e.id,
			start: new Date(e.start_time),
			end: new Date(e.end_time),
			text: e.title,
		}));
	});
</script>

<PageMetadata title="Calendar View" />

<Banner
	title="Calendar View"
	description="Easily schedule for events at ITea Lab via the calendar view"
/>

<article class="scroll large-height" id="svar">
	<WillowDark>
		<Calendar
			{events}
			readonly
			view="week"
			views={[
				{
					id: "week",
					sections: {
						timeGrid: {
							yScale: { startHour: 6, endHour: 22, snapStep: 30 },
						},
					},
				},
				"month",
			]}
		/>
	</WillowDark>
</article>

<style>
	:global(#svar .wx-theme) {
		--wx-color-primary: var(--primary) !important;
		--wx-color-primary-font: var(--on-primary) !important;
		--wx-background: var(--background) !important;
		--wx-background-alt: var(--surface-container-highest) !important;
		--wx-background-hover: var(--primary-container) !important;
		--wx-calendar-weekend-background: var(--surface) !important;
	}

	:global(.wx-theme) {
		border-radius: 0;
	}
</style>
