import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { mockEvent, brokenEvent, longMockEvents, mockEvents, mockFooterProps, mockItems as mockNavItems } from "./_mock";

import Banner from "$components/Banner.svelte";
import EventCard from "$components/EventCard.svelte";
import EventsFeed from "$components/EventsFeed.svelte";
import Footer from "$components/Footer.svelte";
import LoginForm from "$components/LoginForm.svelte";
import Navigation from "$components/Navigation.svelte";
import PageMetadata from "$components/PageMetadata.svelte";
import TextClock from "$components/TextClock.svelte";

// MARK: Banner
describe("/Banner.svelte", () => {
	it("...should render h1", async () => {
		const { getByRole } = await render(Banner, {
			props: {
				title: "Sample Banner Title", description: "Sample banner description"
			}
		});

		const heading = getByRole("heading", { level: 1 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent("Sample Banner Title");
	});

	it("...should render description if provided", async () => {
		const { getByRole } = await render(Banner, {
			props: {
				title: "Sample Banner Title",
				description: "Sample banner description"
			}
		});

		const description = getByRole("paragraph");
		await expect.element(description).toBeInTheDocument();
	});

	it("...should not render description if not provided", async () => {
		const { getByRole } = await render(Banner, {
			props: { title: "Sample Banner Title" }
		});

		const description = getByRole("paragraph");
		await expect.element(description).not.toBeInTheDocument();
	});
});

// MARK: EventCard
describe("/EventCard.svelte", () => {
	it("...should render h2", async () => {
		const {
			getByRole
		} = await render(EventCard, { props: { event: mockEvent } });

		const heading = getByRole("heading", { level: 2 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent("Mock Event Title");
	});

	it("...should cope with missing data", async () => {
		const {
			getByRole, getByTestId
		} = await render(EventCard, { props: { event: brokenEvent } });

		const image = getByRole("img");
		await expect.element(image).toBeInTheDocument();
		await expect.element(image).toHaveAttribute("src", "https://placehold.co/160x90");
		await expect.element(image).toHaveAttribute("alt", "Event image");

		const startDate = getByTestId("event-start-date");
		await expect.element(startDate).toBeInTheDocument();
		await expect.element(startDate).toHaveTextContent("TBA");

		const endDate = getByTestId("event-end-date");
		await expect.element(endDate).toBeInTheDocument();
		await expect.element(endDate).toHaveTextContent("TBA");

		const location = getByTestId("event-location");
		await expect.element(location).toBeInTheDocument();
		await expect.element(location).toHaveTextContent("TBA");
	});
});

// MARK: EventsFeed
describe("/EventsFeed.svelte", () => {
	it("...should render search tools correctly", async () => {
		const { getByTestId } = await render(EventsFeed, { props: { events: mockEvents } });

		// Expect a <search> grid-based region
		const search = getByTestId("events-search");
		await expect.element(search).toBeInTheDocument();
		await expect.element(search).toHaveClass("grid");
	});

	it("...should implement searching correctly", async () => {
		const { getByTestId } = await render(EventsFeed, { props: { events: mockEvents } });

		// Expect an <input> tag for searching
		const searchInput = getByTestId("search-input");
		await expect.element(searchInput).toBeInTheDocument();
		await expect.element(searchInput).toHaveAttribute("type", "text");

		// Simulate typing in search input
		await searchInput.fill("Title 1");
		await expect.element(searchInput).toHaveValue("Title 1");

		await searchInput.fill("Nonexistent");
		await expect.element(searchInput).toHaveValue("Nonexistent");
	});

	it("...should implement category filtering correctly", async () => {
		const { getByTestId } = await render(EventsFeed, { props: { events: mockEvents } });

		// Expect a <select> tag for category filtering
		const categorySelect = getByTestId("category-select");
		await expect.element(categorySelect).toBeInTheDocument();
		await expect.element(categorySelect).toHaveAttribute("id", "category");

		// Simulate category selection
		await categorySelect.selectOptions("Workshop");
		await expect.element(categorySelect).toHaveValue("Workshop");

		// Simulate category selection
		await categorySelect.selectOptions("Seminar");
		await expect.element(categorySelect).toHaveValue("Seminar");
	});

	it("...should implement pagination correctly", async () => {
		const { getByRole, getByTestId } = await render(EventsFeed, { props: { events: longMockEvents } });

		// Expect pagination <nav class="center-align">
		const pagination = getByRole("navigation");
		await expect.element(pagination).toBeInTheDocument();
		await expect.element(pagination).toHaveClass("center-align");

		// Expect info
		const paginationInfo = getByTestId("pagination-info");
		await expect.element(paginationInfo).toBeInTheDocument();
		await expect.element(paginationInfo).toHaveTextContent("Page 1 of 3");

		// Expect buttons
		const nextButton = getByRole("button", { name: "Next" });
		const prevButton = getByRole("button", { name: "Previous" });
		await expect.element(nextButton).toBeInTheDocument();
		await expect.element(prevButton).toBeInTheDocument();

		// Simulate clicking next page
		await nextButton.click();
		await expect.element(paginationInfo).toHaveTextContent("Page 2 of 3");

		// Simulate clicking previous page
		await prevButton.click();
		await expect.element(paginationInfo).toHaveTextContent("Page 1 of 3");
	});

	it("...should cope with empty event list", async () => {
		const { getByText } = await render(EventsFeed, { props: { events: [] } });

		const noEventsMessage = getByText("No events found");
		await expect.element(noEventsMessage).toBeInTheDocument();
	});
});

// MARK: Footer
describe("/Footer.svelte", () => {
	it("...should display the correct main heading", async () => {
		const { getByRole } = await render(Footer, { props: mockFooterProps });

		const heading = getByRole("heading", { level: 1 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent("ITea Lab");
	});
});

// MARK: LoginForm
describe("/LoginForm.svelte", () => {
	it("...should render username and password fields", async () => {
		const { getByLabelText } = await render(LoginForm);

		const emailInput = getByLabelText("Email");
		const passwordInput = getByLabelText("Password");

		await expect.element(emailInput).toBeInTheDocument();
		await expect.element(passwordInput).toBeInTheDocument();
	});

	it("...should render a submit button", async () => {
		const { getByRole } = await render(LoginForm);

		const submitButton = getByRole("button", { name: "Login" });
		await expect.element(submitButton).toBeInTheDocument();
	});
});

// MARK: Navigation
describe("/Navigation.svelte", () => {
	it("...should display the wordmark SVG", async () => {
		const { getByRole } = await render(Navigation);

		const svg = getByRole("img");
		await expect.element(svg).toBeInTheDocument();
	});

	it("...should display the navigation links", async () => {
		const { getByTestId } = await render(Navigation, { props: { menuItems: mockNavItems } });

		// There will always be two versions of the menu items in top and bottom nav
		// Test each nav has the correct number of links i.e. children
		const topNav = getByTestId("navigation-top");
		const bottomNav = getByTestId("navigation-bottom");

		await expect.element(topNav).toBeInTheDocument();
		await expect.element(bottomNav).toBeInTheDocument();

		await expect.element(topNav).toHaveTextContent("Home");
		await expect.element(topNav).toHaveTextContent("About");
		await expect.element(topNav).toHaveTextContent("Services");
		await expect.element(topNav).toHaveTextContent("Contact");

		await expect.element(bottomNav).toHaveTextContent("Home");
		await expect.element(bottomNav).toHaveTextContent("About");
		await expect.element(bottomNav).toHaveTextContent("Services");
		await expect.element(bottomNav).toHaveTextContent("Contact");
	});

	it("...should render external links with target and rel attributes", async () => {
		const externalItems = [
			{ name: "External Link", href: "https://example.com", icon: "external", external: true }
		];

		const { getByTestId } = await render(Navigation, { props: { menuItems: externalItems } });

		const link = getByTestId("external-t0");
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute("href", "https://example.com");
		await expect.element(link).toHaveAttribute("target", "_blank");
		await expect.element(link).toHaveAttribute("rel", "noopener noreferrer");
	});
});

// MARK: PageMetadata
describe("/PageMetadata.svelte", () => {
	it("...should configure the correct metadata", async () => {
		await render(PageMetadata, {
			props: {
				title: "Test Title",
				description: "Test description for the page.",
				keywords: "test, page, metadata",
			}
		});

		expect(document.title).toBe(`Test Title | Tradao by ITea Lab™`);

		const metaDescription = document.querySelector('meta[name="description"]');
		expect(metaDescription).toBeInTheDocument();
		expect(metaDescription).toHaveAttribute("content", "Test description for the page.");

		const metaKeywords = document.querySelector('meta[name="keywords"]');
		expect(metaKeywords).toBeInTheDocument();
		expect(metaKeywords).toHaveAttribute("content", "test, page, metadata");
	});

	it("...should cope with optional metadata", async () => {
		await render(PageMetadata, {});

		expect(document.title).toBe(`| Tradao by ITea Lab™`);

		const metaDescription = document.querySelector('meta[name="description"]');
		expect(metaDescription).not.toBeInTheDocument();

		const metaKeywords = document.querySelector('meta[name="keywords"]');
		expect(metaKeywords).not.toBeInTheDocument();
	});
});

// MARK: TextClock
describe("/TextClock.svelte", () => {
	it("...should render the current date and time", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-01-01T10:30:00Z"));

		const { getByTestId } = await render(TextClock);

		const timeElement = getByTestId("time");
		await expect.element(timeElement).toBeInTheDocument();
		await expect.element(timeElement).not.toBeEmptyDOMElement();

		const dateElement = getByTestId("date");
		await expect.element(dateElement).toBeInTheDocument();
		await expect.element(dateElement).not.toBeEmptyDOMElement();

		vi.useRealTimers();
	});

	it("...should update time every minute", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-01-01T10:30:00Z"));

		const { getByTestId } = await render(TextClock);

		const timeElement = getByTestId("time");
		const initialTime = timeElement.element().textContent;

		vi.advanceTimersByTime(60000);
		await Promise.resolve();

		expect(timeElement.element().textContent).not.toBe(initialTime);

		vi.useRealTimers();
	});
});
