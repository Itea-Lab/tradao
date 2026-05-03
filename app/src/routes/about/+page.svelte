<script lang="ts">
	import PageMetadata from "$components/PageMetadata.svelte";
</script>

<PageMetadata title="About Tradao" description="" keywords="" />

<div class="grid">
	<div class="s12 center-align large-padding">
		<h1 class="small">An Event Management Platform</h1>
		<h2 class="small">Built by and for ITea Lab</h2>
	</div>

	<div class="s12 medium-padding">
		<p class="large-text">
			Ideated in June 2025, Tradao is a platform dedicated to event management at
			ITea Lab. As a community of R&D Computer Science students, we use our
			expertise not only in innovative business and industry solutions, but also in
			streamlining our internal processes.
		</p>
	</div>

	<div class="s12 medium-padding">
		<h2 class="small">Meet the Team</h2>
		<p class="small-text">Note: Vietnamese names are in "last, first" format</p>
	</div>

	<div class="s3 medium-padding center-align member">
		<img src="/img/pfp-triet.jpg" alt="PFP" class="shape sunny" width="256" height="256">
		<h3 class="small">Nguyen&nbsp;Ta Minh&nbsp;Triet</h3>
		<p class="large-text">Sole Author</p>
	</div>

	<div class="s3 medium-padding center-align member">
		<img src="/img/pfp-thinh.jpg" alt="PFP" class="shape sunny" width="256" height="256">
		<h3 class="small">Nguyen&nbsp;Khanh Phuc&nbsp;Thinh</h3>
		<p class="large-text">Supervisor / Client</p>
	</div>

	<div class="s3 medium-padding center-align member">
		<img src="/img/pfp-bao.jpg" alt="PFP" class="shape sunny" width="256" height="256">
		<h3 class="small">Huynh&nbsp;Nguyen Quoc&nbsp;Bao</h3>
		<p class="large-text">Supervisor / Client</p>
	</div>

	<div class="s3 medium-padding center-align member">
		<h3 class="small">+ Rest of ITea Lab</h3>
		<p class="large-text">Client / Testers</p>
	</div>
</div>

<style>
	.member img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
	}
</style>
