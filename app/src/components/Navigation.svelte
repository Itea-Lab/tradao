<script lang="ts">
	import TextClock from "./TextClock.svelte";

	const modes = [
		{ id: "auto", icon: "routine" },
		{ id: "light", icon: "light_mode" },
		{ id: "dark", icon: "dark_mode" },
	];

	let iMode = $state(0);

	function updateTheme() {
		iMode = (iMode + 1) % modes.length;
		ui("mode", modes[iMode].id);
	}

	let {
		menuItems,
	}: {
		menuItems: {
			name: string;
			href: string;
			icon: string;
			external: boolean;
		}[];
	} = $props();
</script>

{#snippet UIModeButton()}
	<div>
		<button
			class="transparent circle"
			onclick={updateTheme}
			data-testid="theme-toggle-button"
		>
			<i>{modes[iMode].icon}</i>
		</button>
	</div>
{/snippet}

{#snippet NavigationMenu(offset: "left" | "right", isOnTop = false)}
	<div data-ui="#menu">
		<button class="transparent circle" data-testid="menu-button">
			<i>menu</i>
		</button>
		<menu id="menu" class="{offset} {isOnTop ? 'top' : ''} no-wrap" data-testid="navigation-menu">
			{#each menuItems as item, index}
				<li>
					<a
						href={item.href}
						target={item.external ? "_blank" : "_self"}
						rel={item.external ? "noopener noreferrer" : ""}
						data-testid={`${item.icon}-m${index}`}
					>
						<i class="prefix-icon">{item.icon}</i>
						{item.name}
					</a>
				</li>
			{/each}
		</menu>
	</div>
{/snippet}

<!-- Medium & Large Screen: Top navigation bar -->
<nav class="top m l" data-testid="navigation-top">
	<p class="large-text">
		<a href="/">
			<img class="logo light" src="/logos/logo.svg" alt="Tradao Logo" />
			<img class="logo dark" src="/logos/logo_dark.svg" alt="Tradao Logo" />
		</a>
	</p>

	<div class="max"></div>

	<div class="row">
		<TextClock />

		<span>|</span>

		{#each menuItems as item, index}
			<a
				href={item.href}
				target={item.external ? "_blank" : "_self"}
				rel={item.external ? "noopener noreferrer" : ""}
				data-testid={`${item.icon}-t${index}`}
			>
				<i class="prefix-icon">{item.icon}</i>
				{item.name}
			</a>
		{/each}

		<span>|</span>

		{@render UIModeButton()}
	</div>
</nav>

<!-- Small Screen: Top wordmark -->
<nav class="top s" data-testid="navigation-top-s">
	{@render NavigationMenu("right")}
	<div class="max"></div>

	<TextClock />

	<div class="max"></div>
	{@render UIModeButton()}
</nav>

<style>
	.logo {
		height: 3rem;
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
