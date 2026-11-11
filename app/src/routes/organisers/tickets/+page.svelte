<script lang="ts">
	import Banner from "#components/Banner.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import { getEvents } from "#lib/remotes/events.remote.js";
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import { getTicketsWithDetails } from "#lib/remotes/tickets.remote.js";

	let events = $state<Awaited<ReturnType<typeof getEvents>>>();
	let tickets = $state<Awaited<ReturnType<typeof getTicketsWithDetails>>>([]);

	const eventID = page.url.searchParams.get("eventID");
	let currentEvent = $state<string>(eventID || "all");

	const filteredTickets = $derived(
		currentEvent === "all"
			? tickets
			: tickets.filter((t) => t.event_id === currentEvent),
	);

	onMount(async () => {
		events = await getEvents();
		tickets = await getTicketsWithDetails();
	});
</script>

<PageMetadata
	title="Manage Tickets"
	description="View and manage all event tickets in one place."
/>

<Banner
	title="Manage Your Event Tickets"
	description="Easily view and manage all your event tickets in one place."
/>

<!-- MARK: Filter -->
<search class="grid middle-align">
	<div class="s12 m10 field label border round suffix">
		<select
			id="event"
			title="Filter by event"
			data-testid="event-select"
			bind:value={currentEvent}
		>
			<option value="all">All Events</option>
			{#each events as event}
				<option value={event.id}>{event.title}</option>
			{/each}
		</select>
		<label for="event">Filter by event</label>
		<i>arrow_drop_down</i>
	</div>

	<div class="s12 m2">
		<button
			type="button"
			class="responsive"
			onclick={() => getTicketsWithDetails().refresh()}
		>
			<i>refresh</i>
			<span>Refresh</span>
		</button>
	</div>
</search>

<div class="medium-space"></div>

<!-- MARK: Table -->
<div class="large-height scroll surface">
	<table class="stripes">
		<thead class="fixed">
			<tr>
				<th>Event</th>
				<th>Name</th>
				<th>Email</th>
				<th>Survey</th>
			</tr>
		</thead>

		<tbody>
			{#each filteredTickets as ticket}
				<tr>
					<td style="width: 25%;">{ticket.event.title}</td>
					<td style="width: 20%;">{ticket.name}</td>

					<td style="width: 20%;">
						<a class="chip" href={`mailto:${ticket.email}`}>
							<i>email</i>
							<span>{ticket.email}</span>
						</a>
					</td>

					<!-- TODO: Use dl/dt/dd -->
					<td style="width: 25%;">
						<dl>
							{#each ticket.survey.toSorted( (a, b) => a.question.question_text.localeCompare(b.question.question_text), ) as survey}
								<dt>{survey.question.question_text}</dt>
								<dd>{survey.answer_text}</dd>
							{/each}
						</dl>
					</td>
				</tr>
			{/each}
		</tbody>

		<tfoot class="fixed">
			<tr>
				<td colspan="5" class="right-align">
					<small>Total tickets: {tickets.length || 0}</small>
				</td>
			</tr>
		</tfoot>
	</table>
</div>

<style>
	dt {
		font-weight: bold;
	}

	dd::before {
		content: "→ ";
	}
</style>
