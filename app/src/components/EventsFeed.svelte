<script lang="ts">
	import type { Tables } from "#lib/models.js";
	import EventCard from "./EventCard.svelte";
	import { search } from "#lib/utils.js";

	let { events }: { events: Tables<"community_events">[] } = $props();

	let searchQuery = $state("");
	let selectedCategory = $state("all");
	let currentPage = $state(1);
	const itemsPerPage = 5;

	let categories = $derived(
		Array.from(new Set(events.map((event) => event.category!))).sort(),
	);

	let filteredEvents = $derived.by(() => {
		let filtered = events;

		// Apply search filter
		if (searchQuery.trim()) {
			filtered = search(filtered, searchQuery, ["title", "description"]);
		}

		// Apply category filter
		if (selectedCategory !== "all") {
			filtered = filtered.filter(
				(event) => event.category === selectedCategory,
			);
		}

		return filtered;
	});

	let totalPages = $derived(Math.ceil(filteredEvents.length / itemsPerPage));
	let startIndex = $derived((currentPage - 1) * itemsPerPage);
	let eventsToDisplay = $derived(
		filteredEvents.slice(startIndex, startIndex + itemsPerPage),
	);

	function handleSearch(query: string) {
		searchQuery = query;
		currentPage = 1;
	}

	function handleCategoryChange(category: string) {
		selectedCategory = category;
		currentPage = 1;
	}
</script>

<search class="grid" data-testid="events-search">
	<div class="s12 m8 field border round prefix">
		<i class="front">search</i>
		<input
			type="text"
			placeholder="Search by title or description"
			value={searchQuery}
			oninput={(e) => handleSearch((e.target as HTMLInputElement).value)}
			data-testid="search-input"
		/>
	</div>
	<div class="s12 m4 field border round suffix">
		<select
			id="category"
			value={selectedCategory}
			title="Filter by category"
			data-testid="category-select"
			onchange={(e) =>
				handleCategoryChange((e.target as HTMLSelectElement).value)}
		>
			<option value="all">All Categories ({events.length})</option>
			{#each categories as category}
				<option value={category}>
					{category} ({events.filter((e) => e.category === category)
						.length})
				</option>
			{/each}
		</select>
		<i>arrow_drop_down</i>
	</div>
</search>

<div class="space"></div>

{#if filteredEvents.length === 0}
	<p>No events found</p>
{/if}

{#each eventsToDisplay as event (event.id)}
	<EventCard {event} />
{/each}

<nav class="center-align">
	<button
		type="button"
		disabled={currentPage === 1}
		onclick={() => (currentPage -= 1)}
	>
		Previous
	</button>

	<span class="px-3 py-1" data-testid="pagination-info">
		Page {currentPage} of {totalPages}
	</span>

	<button
		type="button"
		disabled={currentPage === totalPages}
		onclick={() => (currentPage += 1)}
	>
		Next
	</button>
</nav>
