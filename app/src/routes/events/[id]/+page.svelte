<script lang="ts">
	import SvelteMarkdown from "@humanspeak/svelte-markdown";
	import PageMetadata from "$components/PageMetadata.svelte";
	import EventRegistrationForm from "$components/EventRegistrationForm.svelte";
	import { formatDate, isEventUpcoming } from "$lib/utils";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let event = $derived(data.event);
	let academicStatus = $derived(data.academicStatus);
	let fieldsOfStudy = $derived(data.fieldsOfStudy);
</script>

<PageMetadata
	title={event.title}
	description={`Join ITea Lab event "${event.title}"!`}
	keywords={`ITea Lab, Tradao, Event, ${event.title}, ${event.category}, Technology, Innovation, Community, Vietnam`}
	image={event.image}
/>

<div class="grid-base" id="event-details-page">
	<article class="border no-padding" style="grid-area: image">
		<img id="thumbnail" src={event.image} alt="{event.title}" class="responsive" />
	</article>

	<article class="border" style="grid-area: head">
		<div class="row wrap">
			<p class="chip">{event.category}</p>
		</div>

		<h1 class="small">{event.title}</h1>

		<p>
			<i class="prefix-icon">person</i>
			<strong>Organiser:</strong>
			{event.organiser.name}
			&lt;<a href={`mailto:${event.organiser.contact_email}`}
				>{event.organiser.contact_email}</a
			>&gt;
		</p>

		<p>
			<i class="prefix-icon">event</i>
			<strong>Date:</strong>
			<time datetime={event.start_time}>{formatDate(event.start_time)}</time>
			&ndash;
			<time datetime={event.end_time}>{formatDate(event.end_time)}</time>
		</p>
	</article>

	<article class="border" style="grid-area: form; overflow-y: scroll;">
		<h2 class="small">Participate in this event</h2>
		{#if isEventUpcoming(event.start_time)}
			<EventRegistrationForm eventID={event.id} {academicStatus} {fieldsOfStudy} />
		{:else}
			<p class="mt-4">This event has ended. Registration is closed.</p>
		{/if}
	</article>

	<article class="border" style="grid-area: loct">
		<h2 class="small">Event Location</h2>
		<p>{event.location}</p>
		<iframe
			src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d538.0976707808976!2d106.6689481567678!3d10.816110200767868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752931fede9f91%3A0x1fe04aae50f65b1f!2zU3dpbmJ1cm5lIFZp4buHdCBOYW0gLSBDxqEgc-G7nyBUUCBIQ00!5e1!3m2!1sen!2sau!4v1750058710892!5m2!1sen!2sau"
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			title="Event Location Map"
			class="responsive"
		></iframe>
	</article>

	<article class="border" style="grid-area: text">
		{#if event.description}
			<SvelteMarkdown source={event.description} />
		{:else}
			<p><em>No description available for this event.</em></p>
		{/if}
	</article>
</div>

<style>
	#event-details-page {
		padding: 1rem;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: auto 540px 1fr;
		grid-template-areas:
			"head head head"
			"image image loct"
			"text text form";

		article {
			margin: 0;
		}
	}

	iframe {
		aspect-ratio: 1;
	}

	#thumbnail {
		object-fit: contain;
	}

	@media (max-width: 768px) {
		#event-details-page {
			padding: 0;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			grid-template-areas:
				"head"
				"image"
				"loct"
				"form"
				"text";
		}

		#event-details-page h1 {
			font-size: 2.5rem;
		}

		#event-details-page h2 {
			font-size: 1.5rem;
		}
	}
</style>
