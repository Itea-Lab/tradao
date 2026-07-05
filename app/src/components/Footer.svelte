<script lang="ts">
	import CustomIcons from "./CustomIcons.svelte";

	let {
		community,
		contact,
	}: {
		community: { name: string; href: string; icon: string }[];
		contact: { email: string; address: string; website: string };
	} = $props();
</script>

<footer class="bottom grid padding">
	<hr class="s12" />

	<div class="s12" id="logos">
		<a href="https://itealab.vercel.app">
			<img class="light" src="/logos/logo-lab.svg" alt="ITea Lab Logo" />
			<img class="dark" src="/logos/logo-lab_dark.svg" alt="ITea Lab Logo" />
		</a>

		<a href="/">
			<img class="light" src="/logos/logo.svg" alt="Tradao Logo" />
			<img class="dark" src="/logos/logo_dark.svg" alt="Tradao Logo" />
		</a>
	</div>

	<p class="s12 large-text">
		A product of ITea Lab, brought to you by
		<a href="/about">Minh-Triet et al.</a>
	</p>

	<div class="s12 m6">
		<p>
			<i class="material-icons">info</i>
			<a href={contact.website} target="_blank" rel="noopener noreferrer">
				{contact.website}
			</a>
		</p>

		<p>
			<i class="material-icons">email</i>
			<a href={`mailto:${contact.email}`}>{contact.email}</a>
		</p>

		<p>
			<i class="material-icons">location_on</i>
			<a
				id="address--text"
				href="https://maps.google.com/?q={encodeURIComponent(contact.address)}"
				target="_blank"
				rel="noopener noreferrer"
			>
				{contact.address}
			</a>
		</p>
	</div>

	<div class="s12 m6" id="community">
		{#each community as item}
			<p>
				<a href={item.href} target="_blank" rel="noopener noreferrer">
					<i class="small right-margin small-margin">
						<CustomIcons name={item.icon} />
					</i>{item.name}
				</a>
			</p>
		{/each}
	</div>
</footer>

<style>
	#logos img {
		height: 4rem;
	}

	#address--text {
		max-width: 80%;
	}

	@media (prefers-color-scheme: dark) {
		.light {
			display: none;
		}
	}

	@media (prefers-color-scheme: light) {
		.dark {
			display: none;
		}
	}
</style>
