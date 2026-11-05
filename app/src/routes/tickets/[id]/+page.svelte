<script lang="ts">
	import { onMount } from "svelte";
	import PageMetadata from "#components/PageMetadata.svelte";
	import Banner from "#components/Banner.svelte";
	import { getDetailedTicket } from "#lib/remotes/tickets.remote.js";
	import { formatDate } from "#lib/utils.js";
	import type { PageProps } from "./$types";

	let { params }: PageProps = $props();
	const ticket = $derived(await getDetailedTicket(params.id));

	const eventDates = $derived({
		start_date: ticket.event.start_time?.split("T")[0],
		end_date: ticket.event.end_time?.split("T")[0],
		start_time: ticket.event.start_time?.split("T")[1]?.substring(0, 5),
		end_time: ticket.event.end_time?.split("T")[1]?.substring(0, 5),
	});

	onMount(() => {
		import("add-to-calendar-button");
	});
</script>

<PageMetadata
	title="Your Event Ticket"
	description="Here is your event ticket from ITea Lab & Tradao"
	keywords="ITea Lab, Tradao, Event Ticket, Ticket, Technology, Innovation, Community, Vietnam"
/>

<Banner title="Here is your event ticket!" />

<article class="center-align" style="max-width: 90ch; margin: auto;">
	{@render TicketHeader()}
	<hr class="large" />
	{@render TicketDetails()}
	<hr class="large" />
	{@render TicketFooter()}
</article>

{#snippet TicketHeader()}
	<h2 class="small">{ticket.event.title}</h2>
{/snippet}

{#snippet TicketDetails()}
	<dl class="grid left-align">
		<dt class="s3 right-align"><strong>Date</strong></dt>
		<dd class="s9 left-align">
			{formatDate(ticket.event.start_time)}
			-
			{formatDate(ticket.event.end_time)}
		</dd>

		<dt class="s3 right-align"><strong>Location</strong></dt>
		<dd class="s9 left-align">{ticket.event.location}</dd>

		<dt class="s3 right-align"><strong>Your name</strong></dt>
		<dd class="s9 left-align">{ticket.name}</dd>

		<dt class="s3 right-align"><strong>Your email</strong></dt>
		<dd class="s9 left-align">{ticket.email}</dd>

		<dt class="s3 right-align"><strong>Ticket created at</strong></dt>
		<dd class="s9 left-align">{formatDate(ticket.created_at!)}</dd>
	</dl>
{/snippet}

{#snippet TicketFooter()}
	<section id="footer">
		<div id="buttons">
			<add-to-calendar-button
				name={ticket.event.title}
				options="'Apple','Google','iCal','Outlook.com'"
				location={ticket.event.location}
				startDate={eventDates.start_date}
				endDate={eventDates.end_date}
				startTime={eventDates.start_time}
				endTime={eventDates.end_time}
				timeZone="Asia/Ho_Chi_Minh"
				organizer={`${ticket.event.organiser.name}|contact.itealab@gmail.com`}
				attendee={`${ticket.name}|${ticket.email}`}
				listStyle="overlay"
				lightMode="system"
			></add-to-calendar-button>
		</div>
		<p>{ticket.id}</p>
	</section>
{/snippet}

<style>
	#footer #buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 1rem;
	}
</style>
