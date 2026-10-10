<script lang="ts">
	import "add-to-calendar-button";
	import PageMetadata from "$components/PageMetadata.svelte";
	import Banner from "$components/Banner.svelte";
	import { formatDate } from "$lib/utils";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const ticket = $derived(data.ticket);
	// const saveURL = $derived(data.saveURL);
	const eventDates = $derived({
		start_date: ticket.event_start_time?.split("T")[0],
		end_date: ticket.event_end_time?.split("T")[0],
		start_time: ticket.event_start_time?.split("T")[1]?.substring(0, 5),
		end_time: ticket.event_end_time?.split("T")[1]?.substring(0, 5),
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
	<h2 class="small">{ticket.event_title}</h2>
{/snippet}

{#snippet TicketDetails()}
	<dl class="grid left-align">
		<dt class="s6 right-align">
			<strong>Name</strong>
		</dt>
		<dd class="s6 left-align">{ticket.name}</dd>
		<dt class="s6 right-align">
			<strong>Email</strong>
		</dt>
		<dd class="s6 left-align">{ticket.email}</dd>
		<dt class="s6 right-align">
			<strong>Academic Year</strong>
		</dt>
		<dd class="s6 left-align">{ticket.academic_year}</dd>
		<dt class="s6 right-align">
			<strong>Field of Study</strong>
		</dt>
		<dd class="s6 left-align">{ticket.field_of_study}</dd>
		<dt class="s6 right-align">
			<strong>Major</strong>
		</dt>
		<dd class="s6 left-align">{ticket.major}</dd>
		<dt class="s6 right-align">
			<strong>Participating</strong>
		</dt>
		<dd class="s6 left-align">{ticket.participate ? "Yes" : "No"}</dd>
		<dt class="s6 right-align">
			<strong>Created At</strong>
		</dt>
		<dd class="s6 left-align">{formatDate(ticket.created_at!)}</dd>
	</dl>
{/snippet}

{#snippet TicketFooter()}
	<section id="footer">
		<div id="buttons">
			<!-- Deactivated until replaced by Apple Wallet -->
			<!-- <a href={saveURL} target="_blank" rel="noopener noreferrer">
				<img
					src="/buttons/enAU_add_to_google_wallet_add-wallet-badge.svg"
					alt="Add to Google Wallet"
				/>
			</a> -->
			<add-to-calendar-button
				name={ticket.event_title}
				options="'Apple','Google','iCal','Outlook.com','Yahoo'"
				location={ticket.event_location}
				startDate={eventDates.start_date}
				endDate={eventDates.end_date}
				startTime={eventDates.start_time}
				endTime={eventDates.end_time}
				timeZone="currentBrowser"
				organizer={`${ticket.organiser_name}|contact.itealab@gmail.com`}
				attendee={`${ticket.name}|${ticket.email}`}
				buttonStyle="round"
				listStyle="overlay"
				lightMode="system"
			></add-to-calendar-button>
		</div>
		<p>{ticket.ticket_id}</p>
		<p class="small">
			Note: Add to Google Wallet button is only available for testers.
		</p>
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
