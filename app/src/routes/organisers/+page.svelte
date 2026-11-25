<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import { getProfile, logout } from "#lib/remotes/auth.remote.js";
	import type { Tables } from "#lib/models.js";
	import { showSnackbar } from "#lib/utils.js";
	import type { PageData } from "./$types";

	import PageMetadata from "#components/PageMetadata.svelte";
	import ProfileForm from "#components/ProfileForm.svelte";
	import Dialogue from "#components/Dialogue.svelte";
	import Banner from "#components/Banner.svelte";

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
		profile = await getProfile(data.user.id).catch((e) => {
			showSnackbar(e, "error");
			console.error(e);
			return null;
		});
	});

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

	function closeDialogue() {
		goto("", {
			state: { dialog: null, itemID: null },
			shallow: true,
			replace: true,
		});
	}
</script>

<PageMetadata
	title="Organiser Home"
	description="Manage ITea Lab events and Tradao tickets here"
	keywords="ITea Lab, Tradao, Organiser Home, Events, Tickets, Technology, Innovation, Community, Vietnam"
/>

<Banner
	title={`Welcome, ${data.user.user_metadata.display_name || data.user.email}!`}
	description="Manage events from creation to ticketing and check-in."
/>

<section id="page">
	<hr class="bottom-margin" />

	<div class="grid">
		{@render Tile("Manage Events", "event", "/organisers/events")}
		{@render Tile("Manage Tickets", "local_activity", "/organisers/tickets")}
		{@render Tile("Check-in Tickets", "camera", "/organisers/check-in")}
	</div>

	<hr class="vertical-margin" />

	<div class="row center-align">
		<button class="border" onclick={() => openDialogue("edit")}>
			<i>edit</i>
			<span>Update profile</span>
		</button>

		<button class="border" onclick={handleLogout}>
			<i>logout</i>
			<span>Sign out</span>
		</button>
	</div>
</section>

{#if page.state.dialog === "edit"}
	<Dialogue onClose={closeDialogue}>
		<header class="row">
			<h5 class="max">Edit Event</h5>

			<button class="circle border" onclick={closeDialogue}>
				<i>close</i>
				<span class="tooltip">Close</span>
			</button>
		</header>

		<div class="scroll">
			<div class="space"></div>
			<ProfileForm profile={profile || undefined} onSuccess={closeDialogue} />
		</div>
	</Dialogue>
{/if}

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

	.scroll {
		border-radius: 0;
	}

	#page {
		max-width: 120ch;
		margin: auto;
	}
</style>
