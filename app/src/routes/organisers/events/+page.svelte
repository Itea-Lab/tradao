<script lang="ts">
	import { goto, refreshAll } from "$app/navigation";
	import { page } from "$app/state";
	import { formatDate } from "#lib/utils.js";
	import { showSnackbar } from "#lib/snackbar.js";
	import { deleteEvent, getEventParticipants } from "#lib/remotes/events.remote.js";
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
							class="responsive fill"
							disabled={event.attendee_count === 0}
							onclick={() => openDialogue("participants", event.id)}
						>
							{event.attendee_count === 0 ? "None" : event.attendee_count}
						</button>
					</td>
					<td>
						<div class="row middle-align" style="gap: 0.5rem">
							<!-- Edit Event Thumbnail -->
							<button
								class="chip round"
								type="button"
								onclick={() => openDialogue("thumbnail", event.id)}
							>
								<i>image</i>
								<span class="tooltip bottom">Edit thumbnail</span>
							</button>

							<!-- Edit Event Details -->
							<button
								class="chip round"
								type="button"
								onclick={() => openDialogue("edit", event.id)}
							>
								<i>edit</i>
								<span class="tooltip bottom">Edit details</span>
							</button>

							<!-- Delete Event -->
							<button
								class="chip round"
								type="button"
								onclick={() => openDialogue("delete", event.id)}
							>
								<i>delete</i>
								<span class="tooltip bottom">Delete</span>
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

			<button class="circle border extend" onclick={closeDialog}>
				<i>close</i>
				<span>Close</span>
			</button>
		</header>

		<div class="space"></div>

		<p>Are you sure you want to delete this event?</p>

		<nav class="right-align">
			<button
				type="button"
				class="responsive error"
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

			<button class="circle border extend" onclick={() => goto(`/organisers/tickets`)}>
				<i>open_in_full</i>
				<span>View in Manage Tickets</span>
			</button>

			<button class="circle border extend">
				<i>refresh</i>
				<span>Refresh</span>
			</button>

			<button class="circle border extend" onclick={closeDialog}>
				<i>close</i>
				<span>Close</span>
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
