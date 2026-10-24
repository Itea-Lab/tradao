<script lang="ts">
	import { goto, refreshAll } from "$app/navigation";
	import { page } from "$app/state";
	import { formatDate } from "#lib/utils.js";
	import { getEventParticipants } from "#lib/remotes/events.remote.js";
	import type { PageProps } from "./$types";

	import Banner from "#components/Banner.svelte";
	import Dialogue from "#components/Dialogue.svelte";
	import EventCreationForm from "#components/EventCreationForm.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";

	let { data }: PageProps = $props();
	let searchQuery = $state("");

	function getParticipantsCount(eventId: string) {
		const event = data.events.find((e) => e.id === eventId);
		return event ? event.attendee_count : 0;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") closeDialog();
	}

	function closeDialog() {
		goto("", {
			state: { dialog: null, itemID: null },
			shallow: true,
			replace: true,
		});
	}

	function openDialogue(
		type: "create" | "edit" | "delete" | "participants",
		eventId: string | null = null,
	) {
		goto("", {
			state: { dialog: type, itemID: eventId },
			shallow: true,
			replace: true,
		});
	}

	function onSuccess() {
		closeDialog();
		refreshAll();
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<PageMetadata title="Manage Events" />
<Banner title="Manage Events" />

<!-- MARK: Search -->
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

	<div class="s12 m3 right-align">
		<button
			type="button"
			class="responsive large round"
			onclick={() => openDialogue("create")}
		>
			<i>add</i>
			Create New Event
		</button>
	</div>

	<div class="s12 m1 right-align">
		<button type="button" class="responsive large round">
			<i>refresh</i>
			Refresh
		</button>
	</div>
</search>

<div class="medium-space"></div>

<!-- MARK: Table -->
<div class="large-height scroll surface" id="table-overflow">
	<table class="stripes">
		<thead class="fixed">
			<tr>
				<th>Event</th>
				<th>Category</th>
				<th>Start Time</th>
				<th>End Time</th>
				<th>Location</th>
				<th>Participants</th>
				<th>Actions</th>
			</tr>
		</thead>

		<tbody>
			{#each data.events as event}
				<tr>
					<td>{event.title}</td>
					<td>{event.category}</td>
					<td>{formatDate(event.start_time)}</td>
					<td>{formatDate(event.end_time)}</td>
					<td>{event.location}</td>
					<td class="center-align">
						<button
							class="responsive"
							onclick={() => openDialogue("participants", event.id)}
						>
							{event.attendee_count === 0 ? "None" : event.attendee_count}
						</button>
					</td>
					<td>
						<div class="row middle-align" style="gap: 0">
							<button
								class="transparent circle"
								type="button"
								onclick={() => openDialogue("edit", event.id)}
							>
								<i>edit</i>
							</button>
							<button
								class="transparent circle"
								type="button"
								onclick={() => openDialogue("delete", event.id)}
							>
								<i>delete</i>
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>

		<tfoot class="fixed">
			<tr>
				<td colspan="7" class="right-align">
					<small>{data.events.length} events</small>
				</td>
			</tr>
		</tfoot>
	</table>
</div>

<!-- MARK: Dialogue -->
{#if page.state.dialog === "create"}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Create New Event</h5>

			<button class="round border" onclick={closeDialog}>
				<i>close</i>
				<span class="tooltip left">Close</span>
			</button>
		</header>

		<div class="space"></div>

		<div class="scroll">
			<EventCreationForm {onSuccess} />
		</div>
	</Dialogue>
{/if}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "edit" && page.state.itemID}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Edit Event</h5>

			<button class="round border" onclick={closeDialog}>
				<i>close</i>
				<span class="tooltip left">Close</span>
			</button>
		</header>

		<div class="space"></div>

		<div class="scroll">
			<EventCreationForm
				event={data.events.find((e) => e.id === page.state.itemID)}
				{onSuccess}
			/>
		</div>
	</Dialogue>
{/if}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "delete" && page.state.itemID}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Delete Event</h5>

			<button class="round border" onclick={closeDialog}>
				<i>close</i>
				<span class="tooltip left">Close</span>
			</button>
		</header>

		<div class="space"></div>

		<p>Are you sure you want to delete this event?</p>

		<nav class="right-align">
			<button type="button" class="responsive error">
				<i>delete</i> Delete
			</button>
		</nav>
	</Dialogue>
{/if}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "participants" && page.state.itemID}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Attendees</h5>

			<button class="round border">
				<i>open_in_full</i>
				<span class="tooltip left">View in Manage Tickets</span>
			</button>

			<button class="round border">
				<i>refresh</i>
				<span class="tooltip left">Refresh</span>
			</button>

			<button class="round border" onclick={closeDialog}>
				<i>close</i>
				<span class="tooltip left">Close</span>
			</button>
		</header>

		<div class="medium-height scroll surface-container-high">
			{#if getParticipantsCount(page.state.itemID) === 0}
				<p class="center-align">No participants found.</p>
			{:else}
				<table class="stripes">
					<thead class="fixed">
						<tr>
							<th>Name</th>
							<th>Email</th>
						</tr>
					</thead>

					<tbody>
						{#each await getEventParticipants(page.state.itemID) as participant}
							<tr>
								<td>{participant.name}</td>
								<td>
									<a href="mailto:{participant.email}">
										{participant.email}
									</a>
								</td>
							</tr>
						{/each}
					</tbody>

					<tfoot class="fixed">
						<tr>
							<td colspan="2" class="right-align">
								<small>
									{getParticipantsCount(page.state.itemID)} participants
								</small>
							</td>
						</tr>
					</tfoot>
				</table>
			{/if}
		</div>
	</Dialogue>
{/if}

<style>
	#table-overflow {
		width: 100%;
		max-width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	#table-overflow table {
		min-width: 90ch;
	}

	.scroll {
		border-radius: 0;
	}
</style>
