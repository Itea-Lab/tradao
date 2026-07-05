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

	<div class="s12 m8 l6">
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

	<div class="s12 m4 l3" id="community">
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

	<div class="s1 m1 l3" id="leaf">
		<svg class="medium-opacity" id="leaf--graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 90">
			<path
				fill="var(--primary)"
				d="M9.76426 0C9.76426 0 17.1691 7.18412 25.1775 10.0805C84.482 31.5312 59.4707 73.3326 58.6548 73.4704C58.6548 73.4704 55.3293 67.6792 50.837 64.376C22.331 43.4199 16.5372 19.2984 16.5372 19.2984C16.5372 19.2984 22.9339 48.3243 48.2943 66.385C53.8955 70.3719 57.6882 80.1885 59.2936 90C59.2936 90 55.3232 88.3958 53.6159 87.9613C52.9501 83.6167 51.5581 79.4564 49.2048 75.74C13.7606 79.96 2.152 51.3996 0.63549 41.4408C-2.94384 17.9203 9.76426 0 9.76426 0Z"
			/>
		</svg>
	</div>
</footer>

<style>
	#logos img {
		height: 4rem;
	}

	#address--text {
		max-width: 80%;
	}

	@media (width >= 994px) {
		#leaf {
			height: 3rem;
		}

		#leaf--graphic {
			aspect-ratio: 23 / 32;
			max-width: 180px;
			position: absolute;
			translate: 0 -7rem;
		}
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
