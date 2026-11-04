<script lang="ts">
	import { goto } from "$app/navigation";
	import { logout } from "#lib/remotes/auth.remote.js";
	import { showSnackbar } from "#lib/snackbar.js";

	import PageMetadata from "#components/PageMetadata.svelte";
	import Banner from "#components/Banner.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let username = $derived(data.user?.email ?? "User");

	async function handleLogout() {
		try {
			await logout().then(({ redirectTo }) => {
				showSnackbar("Successfully logged out.");
				goto(redirectTo ?? "/");
			});
		} catch (error) {
			console.error("Logout failed:", error);
			showSnackbar("Logout failed. Please try again.", "error");
		}
	}
</script>

<PageMetadata
	title="Organiser Home"
	description="Manage ITea Lab events and Tradao tickets here"
	keywords="ITea Lab, Tradao, Organiser Home, Events, Tickets, Technology, Innovation, Community, Vietnam"
/>

<Banner
	title="Organiser Dashboard"
	description="Manage events from creation to ticketing and check-in."
/>

<section id="page">
	<hr class="bottom-margin" />

	<p class="center-align">
		You are signed in as {username}.
		<button onclick={handleLogout}>Sign out</button>
	</p>

	<hr class="vertical-margin" />

	<div class="grid">
		{@render Tile("Manage Events", "event", "/organisers/events")}
		{@render Tile("Manage Tickets", "local_activity", "/organisers/tickets")}
		{@render Tile("Check-in Tickets", "camera", "/organisers/check-in")}
	</div>
</section>

{#snippet Tile(title: string, icon: string, href: string)}
	<a class="block s12 m4" {href}>
		<article>
			<i class="extra">{icon}</i>
			<h2>{title}</h2>
			<div class="row right-align">
				<i>arrow_forward</i>
			</div>
		</article>
	</a>
{/snippet}

<style>
	article h2 {
		font-size: 2em;
	}

	#page {
		max-width: 120ch;
		margin: auto;
	}
</style>
