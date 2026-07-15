<script lang="ts">
	import PageMetadata from "$components/PageMetadata.svelte";
</script>

<PageMetadata
	title="About Tradao"
	description="An Platform for Event Management and Ticketing, dedicated to ITea Lab &mdash; Swinburne HCMC Innovation Hub"
	keywords="Swinburne, ITea Lab, Tradao, Events, Tickets, Club, Community, Student, Technology, Innovation, Community, Vietnam"
/>

<div class="grid">
	<div class="s12 center-align padding">
		<h1 class="small">Event Management and Ticketing</h1>
		<h2 class="small">Dedicated to ITea Lab</h2>
	</div>

	<div class="s12 padding">
		<p class="large-text">
			Ideated in June 2025, Tradao is a platform dedicated to event management at
			ITea Lab &mdash; a community of IT/CS student at the Swinburne University
			campus in Ho Chi Minh City, Vietnam. At ITea Lab, we not only apply our
			expertise in innovative business and industry solutions, but also in
			streamlining our internal processes.
		</p>

		<p class="large-text">
			Our events include workshops, seminars, and networking sessions, occurring 1-2
			times per semesters at the campus location. The platform enables registration,
			ticketing, automatic reminders, check-in, and post-event analytics.
		</p>
	</div>

	<div class="s12 padding">
		<h2 class="small">Core Team</h2>
		<p>Note: Vietnamese names are in "last first" format</p>
	</div>

	<div class="s12 m6 l3 padding center-align member">
		<img
			src="/img/pfp-triet.jpg"
			alt="PFP"
			class="shape sunny"
			width="256"
			height="256"
		/>
		<h3 class="small">Nguyen&nbsp;Ta Minh&nbsp;Triet</h3>
		<p class="large-text">Sole Author and Developer</p>
	</div>

	<div class="s12 m6 l3 medium-padding center-align member">
		<img
			src="/img/pfp-thinh.jpg"
			alt="PFP"
			class="shape sunny"
			width="256"
			height="256"
		/>
		<h3 class="small">Nguyen&nbsp;Khanh Phuc&nbsp;Thinh</h3>
		<p class="large-text">Supervisor / Client</p>
	</div>

	<div class="s12 m6 l3 medium-padding center-align member">
		<img
			src="/img/pfp-bao.jpg"
			alt="PFP"
			class="shape sunny"
			width="256"
			height="256"
		/>
		<h3 class="small">Huynh&nbsp;Nguyen Quoc&nbsp;Bao</h3>
		<p class="large-text">Supervisor / Client</p>
	</div>

	<div class="s12 m6 l3 medium-padding center-align member">
		<img
			src="/img/pfp-lat.jpg"
			alt="PFP"
			class="shape sunny"
			width="256"
			height="256"
		/>
		<h3 class="small">Lam An&nbsp;Thinh</h3>
		<p class="large-text">Current Product Owner</p>
	</div>
</div>

<style>
	.member img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
	}
</style>
