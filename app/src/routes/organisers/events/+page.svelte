<script lang="ts">
	import { fade } from "svelte/transition";
	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";

	import Banner from "#components/Banner.svelte";
	import EventCreationForm from "#components/EventCreationForm.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import type { PageProps } from "./$types";
	import SvelteMarkdown from "@humanspeak/svelte-markdown";

	let { data }: PageProps = $props();
	let searchQuery = $state("");

	function openCreateDialog() {
		replaceState("", { dialog: "create", itemID: null });
	}

	function openEditDialog(eventId: string) {
		replaceState("", { dialog: "edit", itemID: eventId });
	}

	function openDeleteDialog(eventId: string) {
		replaceState("", { dialog: "delete", itemID: eventId });
	}

	function closeDialog() {
		replaceState("", { dialog: null, itemID: null });
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") closeDialog();
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<PageMetadata title="Manage Events" />
<Banner title="Manage Events" />

<!-- Search, filter, create new event -->
<search class="grid middle-align">
	<div class="s12 m8 field border round prefix">
		<i class="front">search</i>
		<input
			id="search"
			type="text"
			placeholder="Search events"
			bind:value={searchQuery}
		/>
	</div>
	<div class="s12 m4 right-align">
		<button
			type="button"
			class="responsive large round"
			onclick={openCreateDialog}
		>
			<i>add</i>
			Create New Event
		</button>
	</div>
</search>

<div class="grid">
	{#each data.events as event}
		{@render EventCard(event)}
	{/each}
</div>

{#if page.state.dialog === "create"}
	<div class="overlay blur active"></div>
	<dialog transition:fade open>
		<header class="row">
			<h5 class="max">Create New Event</h5>
			<button
				type="button"
				class="transparent circle"
				onclick={closeDialog}
			>
				<i>close</i>
			</button>
		</header>

		<div class="space"></div>

		<div class="scroll">
			<EventCreationForm />
		</div>
	</dialog>
{/if}

{#if page.state.dialog === "edit" && page.state.itemID}
	<div class="overlay blur active"></div>
	<dialog transition:fade open>
		<header class="row">
			<h5 class="max">Edit Event</h5>
			<button
				type="button"
				class="transparent circle"
				onclick={closeDialog}
			>
				<i>close</i>
			</button>
		</header>

		<div class="space"></div>

		<div class="scroll">
			<EventCreationForm
				event={data.events.find((e) => e.id === page.state.itemID)}
			/>
		</div>
	</dialog>
{/if}

{#if page.state.dialog === "delete" && page.state.itemID}
	<div class="overlay blur active"></div>
	<dialog transition:fade class="round" open>
		<header class="row">
			<h5 class="max">Delete Event</h5>
			<button
				type="button"
				class="transparent circle"
				onclick={closeDialog}
			>
				<i>close</i>
			</button>
		</header>
		<p>Are you sure you want to delete this event?</p>
		<nav class="right-align">
			<button type="button" class="responsive error">
				<i>delete</i> Delete
			</button>
		</nav>
	</dialog>
{/if}

{#snippet EventCard(event: PageProps["data"]["events"][0])}
	<article class="s12 m6">
		<nav class="left-align">
			<button type="button" onclick={() => openEditDialog(event.id)}>
				<i>edit</i> Edit
			</button>
			<button type="button" onclick={() => openDeleteDialog(event.id)}>
				<i>delete</i> Delete
			</button>
		</nav>

		<h2 class="small">{event.title}</h2>

		<p><i>person</i> {event.attendee_count} attendees registered</p>
		<p>
			<i>category</i>
			<strong>Category:</strong>
			{event.category}
		</p>
		<p>
			<i>event</i>
			<strong>Start Time:</strong>
			{new Date(event.start_time).toLocaleString()}
		</p>
		<p>
			<i>event</i>
			<strong>End Time:</strong>
			{new Date(event.end_time).toLocaleString()}
		</p>
		<p>
			<i>location_on</i>
			<strong>Location:</strong>
			{event.location}
		</p>

		{#if event.description}
			<SvelteMarkdown source={event.description} />
		{/if}
	</article>
{/snippet}

<style>
	.scroll {
		border-radius: 0;
	}
</style>
