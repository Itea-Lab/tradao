<script lang="ts">
	import type { Tables } from "$lib/models";
	import { formatDate, isEventUpcoming } from "$lib/utils";

	let { event }: { event: Tables<"community_events"> } = $props();

	const eventLink = $derived(`/events/${event.slug ? event.slug : event.id}`);
</script>

<!-- Event Card Component -->
<!-- Ternary operators counter for empty strings -->

<article class="no-padding grid middle-align border">
	<div class="s12 m4">
		<img
			class="responsive"
			src={event.image ? event.image : "https://placehold.co/160x90"}
			alt={event.title || "Event image"}
		/>
	</div>
	<div class="padding s12 m8">
		<h2>{event.title}</h2>

		<p data-testid="event-date-range">
			<i data-testid="event-date-icon">event</i> <strong>Date:</strong>
			<span data-testid="event-start-date">{event.start_time ? formatDate(event.start_time) : "TBA"}</span>
			&ndash;
			<span data-testid="event-end-date">{event.end_time ? formatDate(event.end_time) : "TBA"}</span>
		</p>

		<p>
			<i data-testid="event-location-icon">location_on</i> <strong>Location:</strong>
			<span data-testid="event-location">{event.location || "TBA"}</span>
		</p>

		<div class="space"></div>

		<a class="button" href={eventLink}>
			{isEventUpcoming(event.start_time!) ? "Register" : "View"}
		</a>
	</div>
</article>

<style>
	h2 {
		font-size: 2rem;
	}
</style>
