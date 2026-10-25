<script lang="ts">
	import { formatDate, isEventUpcoming } from "#lib/utils.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import SvelteMarkdown from "@humanspeak/svelte-markdown";
	import PageMetadata from "#components/PageMetadata.svelte";
	import EventRegistrationForm from "#components/EventRegistrationForm.svelte";
	import type { PageData } from "./$types";
	import Dialogue from "#components/Dialogue.svelte";

	let { data }: { data: PageData } = $props();
	let event = $derived(data.event);
	let survey = $derived(data.survey);

	function closeDialog() {
		goto("", {
			state: { dialog: null, itemID: null },
			shallow: true,
			replace: true,
		});
	}

	function openDialogue(type: "register") {
		goto("", {
			state: { dialog: type, itemID: null },
			shallow: true,
			replace: true,
		});
	}
</script>

<PageMetadata
	title={event.title}
	description={`Join ITea Lab event "${event.title}"!`}
	keywords={`ITea Lab, Tradao, Event, ${event.title}, ${event.category}, Technology, Innovation, Community, Vietnam`}
	image={event.image}
/>

<div class="grid-base" id="event-details-page">
	<!-- MARK: Image -->
	<article class="border no-padding" style="grid-area: image">
		<img id="thumbnail" src={event.image} alt={event.title} class="responsive" />
	</article>

	<!-- MARK: Header -->
	<div class="padding center-align" style="grid-area: head">
		<h1 class="small">{event.title}</h1>

		<div class="space"></div>

		<div>
			{#if isEventUpcoming(event.start_time)}
				<button
					type="button"
					class="large"
					onclick={() => openDialogue("register")}
				>
					<i>how_to_reg</i> Register
				</button>
			{:else}
				<button type="button" class="large" disabled>Event ended</button>
			{/if}
		</div>
	</div>

	<!-- MARK: Date -->
	<div style="grid-area: meta; overflow-y: scroll;">
		<article class="border">
			<h5 class="small"><i>person</i> Organiser</h5>
			<span>
				{event.organiser.name}
			</span>
			<wbr />
			<span>
				<a href={`mailto:${event.organiser.contact_email}`}
					>&lt;{event.organiser.contact_email}&gt;</a
				>
			</span>
		</article>

		<div class="space"></div>

		<article class="border">
			<h5 class="small"><i>event</i> Start date</h5>
			<time datetime={event.start_time}>{formatDate(event.start_time)}</time>
		</article>

		<div class="space"></div>

		<article class="border">
			<h5 class="small"><i>event</i> End date</h5>
			<time datetime={event.end_time}>{formatDate(event.end_time)}</time>
		</article>

		<div class="space"></div>

		<article class="border">
			<h5 class="small"><i>category</i> Category</h5>
			<span>{event.category}</span>
		</article>
	</div>

	<!-- MARK: Location -->
	<article class="border" style="grid-area: loct">
		<h5 class="small"><i>location_on</i> Location</h5>
		<p>{event.location}</p>
		<iframe
			src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d538.0976707808976!2d106.6689481567678!3d10.816110200767868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752931fede9f91%3A0x1fe04aae50f65b1f!2zU3dpbmJ1cm5lIFZp4buHdCBOYW0gLSBDxqEgc-G7nyBUUCBIQ00!5e1!3m2!1sen!2sau!4v1750058710892!5m2!1sen!2sau"
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			title="Event Location Map"
			class="responsive"
		></iframe>
	</article>

	<!-- MARK: Description -->
	<article class="border" style="grid-area: text">
		{#if event.description}
			<SvelteMarkdown source={event.description} />
		{:else}
			<div class="middle-align center-align" style="height: 100%;">
				<div>
					<i class="extra">info</i>
					<h5 class="small">No description available for this&nbsp;event.</h5>
				</div>
			</div>
		{/if}
	</article>
</div>

<!-- MARK: Register -->
{#if page.state.dialog === "register"}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Join the event</h5>

			<button type="button" class="transparent circle" onclick={closeDialog}>
				<i>close</i>
			</button>
		</header>

		<div class="scroll no-round">
			<EventRegistrationForm {event} {survey} />
		</div>
	</Dialogue>
{/if}

<style>
	#event-details-page {
		padding: 1rem;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: auto auto 1fr;
		grid-template-areas:
			"head head head"
			"meta image image"
			"text text loct";

		article {
			margin: 0;
		}
	}

	iframe {
		max-width: 25rem;
		aspect-ratio: 1;
	}

	#thumbnail {
		object-fit: contain;
	}

	@media (max-width: 900px) {
		#event-details-page {
			padding: 0;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			grid-template-areas:
				"head"
				"image"
				"meta"
				"loct"
				"text";
		}

		#event-details-page h1 {
			font-size: 2.5rem;
		}
	}
</style>
