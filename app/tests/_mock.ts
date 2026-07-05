import type { Tables } from "$lib/models";

export const mockEvents: Tables<"community_events">[] = [
	{
		id: "mock_id_1",
		organiser_id: "mock_category_id",
		title: "Mock Event Title 1",
		description: "Mock event description 1",
		start_time: "2024-01-01",
		end_time: "2024-01-02",
		location: "Mock Location 1",
		image: "https://placeholder.co/160x90",
		category: "Workshop",
		created_at: "2024-01-01",
		updated_at: "2024-01-01",
		slug: "mock_event_title_1"
	},
	{
		id: "mock_id_2",
		organiser_id: "mock_category_id",
		title: "Mock Event Title 2",
		description: "Mock event description 2",
		start_time: "2024-02-01",
		end_time: "2024-02-02",
		location: "Mock Location 2",
		image: "https://placeholder.co/160x90",
		category: "Seminar",
		created_at: "2024-02-01",
		updated_at: "2024-02-01",
		slug: "mock_event_title_2"
	},
];

export const mockEvent = mockEvents[0];

export const brokenEvent = {
	...mockEvent, image: "", title: "",
	start_time: "", end_time: "", location: "",
};

// make a long array containing 12 copies of mockEvents[0] to test pagination
// id property must be incremented to avoid duplicate keys in the rendered list
export const longMockEvents = new Array(12)
	.fill(mockEvents[0])
	.map((ev, i) => ({ ...ev, id: `${ev.id}-${i + 1}` }));

export const mockFooterProps = {
	explore: [
		{ name: "Home", href: "/" },
		{ name: "About", href: "/about" },
		{ name: "Services", href: "/services" },
		{ name: "Contact", href: "/contact" }
	],
	community: [
		{ icon: "blog", name: "Blog", href: "/blog" },
		{ icon: "forum", name: "Forum", href: "/forum" },
		{ icon: "events", name: "Events", href: "/events" },
		{ icon: "support", name: "Support", href: "/support" }
	],
	contact: {
		email: "info@itealab.com",
		address: "123 Main St, Anytown, USA",
		website: "https://www.itealab.com",
	}
};

export const mockItems = [
	{ name: "Home", href: "/", icon: "home", external: false },
	{ name: "About", href: "/about", icon: "info", external: false },
	{ name: "Services", href: "/services", icon: "services", external: false },
	{ name: "Contact", href: "/contact", icon: "contact", external: false }
];
