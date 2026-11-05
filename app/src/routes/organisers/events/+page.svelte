<script lang="ts">
	import { goto, refreshAll } from "$app/navigation";
	import { page } from "$app/state";
	import { formatDate, showSnackbar } from "#lib/utils.js";
	import { deleteEvent, getEventParticipants } from "#lib/remotes/events.remote.js";
	import type { PageProps } from "./$types";

	import Banner from "#components/Banner.svelte";
	import Dialogue from "#components/Dialogue.svelte";
	import EventCreationForm from "#components/EventCreationForm.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import EventThumbnailForm from "#components/EventThumbnailForm.svelte";

	let { data }: PageProps = $props();
	let searchQuery = $state("");

	function findEvent(eventId: string) {
		return data.events.find((e) => e.id === eventId);
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
		type: "create" | "edit" | "delete" | "participants" | "thumbnail",
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
		<button type="button" class="responsive large round border">
			<i>refresh</i>
			<span class="tooltip">Refresh</span>
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
							class="responsive chip"
							disabled={event.attendee_count === 0}
							onclick={() => openDialogue("participants", event.id)}
						>
							{event.attendee_count === 0 ? "None" : event.attendee_count}
						</button>
					</td>
					<td>{@render EventMenu(event.id)}</td>
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

<!-- MARK: Menu -->
{#snippet EventMenu(id: string)}
	<div>
		<button class="transparent circle" type="button">
			<i>more_vert</i>
		</button>

		<menu class="group left no-wrap">
			{#each [{ id: "thumbnail", label: "Edit thumbnail", icon: "image" }, { id: "edit", label: "Edit details", icon: "edit" }, { id: "delete", label: "Delete", icon: "delete" }] as item}
				<li class="no-padding">
					<button
						class="transparent no-round responsive left-align"
						type="button"
						onclick={() => {
							openDialogue(item.id as "thumbnail" | "edit" | "delete", id);
						}}
					>
						<i>{item.icon}</i>
						{item.label}
					</button>
				</li>
			{/each}
		</menu>
	</div>
{/snippet}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "create"}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Create New Event</h5>

			<button class="circle border extend" onclick={closeDialog}>
				<i>close</i>
				<span>Close</span>
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

			<button class="circle border extend" onclick={closeDialog}>
				<i>close</i>
				<span>Close</span>
			</button>
		</header>

		<div class="space"></div>

		<div class="scroll">
			<EventCreationForm event={findEvent(page.state.itemID)} {onSuccess} />
		</div>
	</Dialogue>
{/if}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "delete" && page.state.itemID}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Delete Event</h5>
		</header>

		<p class="large-text">
			Are you sure you want to delete the event
			<strong>{findEvent(page.state.itemID)?.title || "Unknown Event"}</strong>?
		</p>

		<p class="large-text">This action cannot be undone.</p>

		<nav class="grid">
			<button
				type="button"
				class="s12 m6 error"
				onclick={async () => {
					if (!page.state.itemID) return;
					await deleteEvent(page.state.itemID).then((res) => {
						if (res.success) {
							showSnackbar("Event deleted successfully", "check");
							closeDialog();
							refreshAll();
						} else {
							showSnackbar(res.message, "error");
						}
					});
				}}
			>
				<i>delete</i> Yes, Delete!
			</button>

			<button type="button" class="s12 m6 border" onclick={closeDialog}>
				<i>close</i> No, Get Me Out Of Here!
			</button>
		</nav>
	</Dialogue>
{/if}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "participants" && page.state.itemID}
	{@const query = getEventParticipants(page.state.itemID)}

	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Attendees</h5>

			<button
				class="circle border extend"
				onclick={() => goto(`/organisers/tickets`)}
			>
				<i>open_in_full</i>
				<span>View in Manage Tickets</span>
			</button>

			<button class="circle border extend" onclick={() => query.refresh()}>
				<i>refresh</i>
				<span>Refresh</span>
			</button>

			<button class="circle border extend" onclick={closeDialog}>
				<i>close</i>
				<span>Close</span>
			</button>
		</header>

		<div class="medium-height scroll surface-container-high">
			{#if findEvent(page.state.itemID)?.attendee_count === 0}
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
						{#each await query as participant}
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
									{findEvent(page.state.itemID)?.attendee_count || NaN} participants
								</small>
							</td>
						</tr>
					</tfoot>
				</table>
			{/if}
		</div>
	</Dialogue>
{/if}

<!-- MARK: Dialogue -->
{#if page.state.dialog === "thumbnail" && page.state.itemID}
	<Dialogue onClose={closeDialog}>
		<header class="row">
			<h5 class="max">Edit Event Thumbnail</h5>

			<button class="circle border extend" onclick={closeDialog}>
				<i>close</i>
				<span>Close</span>
			</button>
		</header>

		<div class="scroll large-height">
			<div class="tiny-space"></div>

			<EventThumbnailForm event={findEvent(page.state.itemID)!!} />
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
