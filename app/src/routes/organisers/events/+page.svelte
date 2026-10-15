<script lang="ts">
	import { goto, refreshAll } from "$app/navigation";
	import { page } from "$app/state";
	import { formatDate } from "#lib/utils.js";
	import type { PageProps } from "./$types";

	import Banner from "#components/Banner.svelte";
	import Dialogue from "#components/Dialogue.svelte";
	import EventCreationForm from "#components/EventCreationForm.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";

	let { data }: PageProps = $props();
	let searchQuery = $state("");

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
		type: "create" | "edit" | "delete",
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
	<div class="s12 m4 right-align">
		<button
			type="button"
			class="responsive large round"
			onclick={() => openDialogue("create")}
		>
			<i>add</i>
			Create New Event
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
					<td class="right-align"
						>{event.attendee_count === 0
							? "None"
							: `${event.attendee_count} people`}</td
					>
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
			<button type="button" class="transparent circle" onclick={closeDialog}>
				<i>close</i>
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
			<button type="button" class="transparent circle" onclick={closeDialog}>
				<i>close</i>
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
			<button type="button" class="transparent circle" onclick={closeDialog}>
				<i>close</i>
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
