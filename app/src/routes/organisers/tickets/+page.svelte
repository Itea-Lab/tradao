<script lang="ts">
	import Banner from "#components/Banner.svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
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
	<div class="s12 m4 field label border round suffix">
		<select id="event" title="Filter by event" data-testid="event-select">
			<option value="all">All Events</option>
		</select>
		<label for="event">Filter by event</label>
		<i>arrow_drop_down</i>
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
				<th>Actions</th>
			</tr>
		</thead>

		<tbody>
			{#each data.tickets as ticket}
				<tr>
					<td style="width: 25%;">{ticket.event_title}</td>
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

					<td style="width: 10%;">
						<div class="row" style="gap: 0;">
							<button class="transparent circle"><i>edit</i></button>
							<button class="transparent circle"><i>delete</i></button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>

		<tfoot class="fixed">
			<tr>
				<td colspan="5" class="right-align">
					<small>Total tickets: {data.tickets.length}</small>
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
