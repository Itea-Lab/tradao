<script lang="ts">
	import Navigation from '$components/Navigation.svelte';
	import Footer from '$components/Footer.svelte';
	import type { LayoutData } from './$types';

	let { children }: { data: LayoutData; children: any } = $props();

	const menuItems = [
		{
			name: 'Organisers',
			href: '/organisers',
			icon: 'manage_accounts',
			external: false
		},
		{
			name: 'About',
			href: '/about',
			icon: 'info',
			external: false
		},
		{
			name: 'Feedback',
			href: 'mailto:contact.itealab@gmail.com',
			icon: 'feedback',
			external: false
		}
	];

	const community = [
		{ icon: 'github', name: 'GitHub', href: 'https://github.com/itea-lab' },
		{ icon: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com/company/itea-lab' },
		{ icon: 'facebook', name: 'Facebook', href: 'https://facebook.com/ITeaLabTeam/' },
	];

	const contact = {
		email: 'contact.itealab@gmail.com',
		address: 'A35 Bach Dang St, Tan Son Hoa Ward, Ho Chi Minh City, Vietnam',
		website: 'https://itealab.vercel.app'
	};
</script>

<Navigation {menuItems} />

<main class="responsive padding">
	{@render children()}
</main>

<Footer {community} {contact} />
