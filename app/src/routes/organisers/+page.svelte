<script lang="ts">
	import { goto } from "$app/navigation";
	import { getProfile, logout } from "#lib/remotes/auth.remote.js";
	import type { Tables } from "#lib/models.js";
	import { showSnackbar } from "#lib/utils.js";

	import PageMetadata from "#components/PageMetadata.svelte";
	import Banner from "#components/Banner.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";

	let profile = $state<Tables<"profiles"> | null>(null);
	let { data }: { data: PageData } = $props();

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

	onMount(async () => {
		profile = await getProfile(data.claims.sub).catch((e) => {
			showSnackbar(e, "error");
			console.error(e);
			return null;
		});
	});
</script>

<PageMetadata
	title="Organiser Home"
	description="Manage ITea Lab events and Tradao tickets here"
	keywords="ITea Lab, Tradao, Organiser Home, Events, Tickets, Technology, Innovation, Community, Vietnam"
/>

<Banner
	title={`Welcome, ${profile ? profile.display_name : data.claims.email}!`}
	description="Manage events from creation to ticketing and check-in."
/>

<section id="page">
	<hr class="bottom-margin" />

	<p class="center-align">
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
