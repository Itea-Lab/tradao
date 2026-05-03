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
			name: 'ITea Lab',
			href: 'https://itealab.vercel.app',
			icon: 'home',
			external: true
		}
	];

	const explore = [
		{ name: 'About', href: '/' },
		{ name: 'Community', href: '/' },
		{ name: 'Join Us', href: '/' }
	];

	const community = [
		{ name: 'GitHub', href: 'https://github.com/itea-lab' },
		{ name: 'Facebook', href: 'https://facebook.com/ITeaLabTeam/' },
		{ name: 'LinkedIn', href: 'https://linkedin.com/company/itea-lab' }
	];

	const contact = {
		email: 'contact.itealab@gmail.com',
		address: 'A35 Bach Dang street, Tan Binh district, Ho Chi Minh city, Vietnam'
	};
</script>

<Navigation {menuItems} />

<main class="responsive padding">
	{@render children()}
</main>

<Footer {explore} {community} {contact} />
