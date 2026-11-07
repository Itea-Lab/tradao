import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { mockEvent, brokenEvent, longMockEvents, mockEvents, mockFooterProps, mockItems as mockNavItems } from "./_mock";

import Banner from "#components/Banner.svelte";
import EventCard from "#components/EventCard.svelte";
import EventsFeed from "#components/EventsFeed.svelte";
import Footer from "#components/Footer.svelte";
import LoginForm from "#components/LoginForm.svelte";
import Navigation from "#components/Navigation.svelte";
import PageMetadata from "#components/PageMetadata.svelte";
import TextClock from "#components/TextClock.svelte";

// MARK: Banner
describe("Banner", () => {
	it("should render h1", async () => {
		const { getByRole } = await render(Banner, {
			props: {
				title: "Sample Banner Title", description: "Sample banner description"
			}
		});

		const heading = getByRole("heading", { level: 1 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent("Sample Banner Title");
	});

	it("should render description if provided", async () => {
		const { getByRole } = await render(Banner, {
			props: {
				title: "Sample Banner Title",
				description: "Sample banner description"
			}
		});

		const description = getByRole("paragraph");
		await expect.element(description).toBeInTheDocument();
	});

	it("should not render description if not provided", async () => {
		const { getByRole } = await render(Banner, {
			props: { title: "Sample Banner Title" }
		});

		expect(document.querySelector("header p")).not.toBeInTheDocument();
	});
});

// MARK: Ev. Card
describe("Event Card", () => {
	it("should render h2", async () => {
		const {
			getByRole
		} = await render(EventCard, { props: { event: mockEvent } });

		const heading = getByRole("heading", { level: 2 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent("Mock Event Title 1");
	});

	it("should cope with missing data", async () => {
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

// MARK: Ev. Feed
describe("Events Feed", () => {
	it("should render search tools correctly", async () => {
		const { getByTestId } = await render(EventsFeed, { props: { events: mockEvents } });

		// Expect a <search> grid-based region
		const search = getByTestId("events-search");
		await expect.element(search).toBeInTheDocument();
		await expect.element(search).toHaveClass("grid");
	});

	it("should implement searching correctly", async () => {
		const { getByRole, getByTestId, getByText } = await render(EventsFeed, { props: { events: mockEvents } });

		// Expect an <input> tag for searching
		const searchInput = getByTestId("search-input");
		await expect.element(searchInput).toBeInTheDocument();
		await expect.element(searchInput).toHaveAttribute("type", "text");

		const searchElement = searchInput.element() as HTMLInputElement;
		searchElement.value = "Title 1";
		searchElement.dispatchEvent(new Event("input", { bubbles: true }));
		await expect.element(searchInput).toHaveValue("Title 1");
		await expect.element(getByRole("heading", { level: 2 })).toHaveTextContent("Mock Event Title 1");

		searchElement.value = "Nonexistent";
		searchElement.dispatchEvent(new Event("input", { bubbles: true }));
		await expect.element(searchInput).toHaveValue("Nonexistent");
		await expect.element(getByText("No events found")).toBeInTheDocument();
	});

	it("should implement category filtering correctly", async () => {
		const { getByRole, getByTestId } = await render(EventsFeed, { props: { events: mockEvents } });

		// Expect a <select> tag for category filtering
		const categorySelect = getByTestId("category-select");
		await expect.element(categorySelect).toBeInTheDocument();
		await expect.element(categorySelect).toHaveAttribute("id", "category");

		const categoryElement = categorySelect.element() as HTMLSelectElement;
		categoryElement.value = "Workshop";
		categoryElement.dispatchEvent(new Event("change", { bubbles: true }));
		await expect.element(categorySelect).toHaveValue("Workshop");
		await expect.element(getByRole("heading", { level: 2 })).toHaveTextContent("Mock Event Title 1");

		categoryElement.value = "Seminar";
		categoryElement.dispatchEvent(new Event("change", { bubbles: true }));
		await expect.element(categorySelect).toHaveValue("Seminar");
		await expect.element(getByRole("heading", { level: 2 })).toHaveTextContent("Mock Event Title 2");
	});

	it("should implement pagination correctly", async () => {
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

		(nextButton.element() as HTMLButtonElement).click();
		await expect.element(paginationInfo).toHaveTextContent("Page 2 of 3");

		(prevButton.element() as HTMLButtonElement).click();
		await expect.element(paginationInfo).toHaveTextContent("Page 1 of 3");
	});

	it("should cope with empty event list", async () => {
		const { getByText } = await render(EventsFeed, { props: { events: [] } });

		const noEventsMessage = getByText("No events found");
		await expect.element(noEventsMessage).toBeInTheDocument();
	});
});

// MARK: Footer
describe("Footer", () => {
	it("should show two logos for ITea Lab and Tradao", async () => {
		const { getByRole } = await render(Footer, { props: mockFooterProps });
		const footer = getByRole("contentinfo").element();

		const logoLinks = footer.querySelectorAll("#logos > a");
		expect(logoLinks).toHaveLength(2);
		expect(Array.from(logoLinks, (link) => link.getAttribute("href"))).toEqual([
			"https://itealab.vercel.app",
			"/"
		]);
		expect(Array.from(footer.querySelectorAll("#logos img"), (image) => image.getAttribute("src"))).toEqual([
			"/logos/logo-lab.svg",
			"/logos/logo-lab_dark.svg",
			"/logos/logo.svg",
			"/logos/logo_dark.svg"
		]);
	});

	it("should display short credit line", async () => {
		const { getByRole } = await render(Footer, { props: mockFooterProps });
		const footer = getByRole("contentinfo").element();

		expect(footer.querySelector(".large-text")).toHaveTextContent(
			"A product of ITea Lab, brought to you by Minh-Triet et al."
		);
	});

	it("should display contact information", async () => {
		const { getByRole } = await render(Footer, { props: mockFooterProps });
		const footer = getByRole("contentinfo").element();

		expect(footer.querySelector(`a[href="${mockFooterProps.contact.website}"]`)).toHaveTextContent(
			mockFooterProps.contact.website
		);
		expect(footer.querySelector(`a[href="mailto:${mockFooterProps.contact.email}"]`)).toHaveTextContent(
			mockFooterProps.contact.email
		);
		expect(footer.querySelector("#address--text")).toHaveTextContent(mockFooterProps.contact.address);
		expect(footer.querySelector("#address--text")).toHaveAttribute(
			"href",
			`https://maps.google.com/?q=${encodeURIComponent(mockFooterProps.contact.address)}`
		);
	});

	it("should display social media links", async () => {
		const { getByRole } = await render(Footer, { props: mockFooterProps });
		const footer = getByRole("contentinfo").element();
		const communityLinks = footer.querySelectorAll("#community a");

		expect(communityLinks).toHaveLength(mockFooterProps.community.length);
		for (const item of mockFooterProps.community) {
			const link = footer.querySelector(`#community a[href="${item.href}"]`);
			expect(link).toHaveTextContent(item.name);
			expect(link).toHaveAttribute("target", "_blank");
			expect(link).toHaveAttribute("rel", "noopener noreferrer");
		}
	});

	it("should display large leaf graphics", async () => {
		const { getByRole } = await render(Footer, { props: mockFooterProps });
		const footer = getByRole("contentinfo").element();
		const leaf = footer.querySelector("#leaf--graphic");

		expect(leaf).toBeInTheDocument();
		expect(leaf).toHaveAttribute("viewBox", "0 0 65 90");
		expect(leaf?.querySelector("path")).toBeInTheDocument();
	});
});

// MARK: Login Form
describe("Login Form", () => {
	it("should render email and password fields", async () => {
		const { getByLabelText } = await render(LoginForm);

		const emailInput = document.querySelector('input[type="email"]');
		const passwordInput = getByLabelText("Password");

		expect(emailInput).toBeInTheDocument();
		await expect.element(passwordInput).toBeInTheDocument();
	});

	it("should render a submit button", async () => {
		const { getByRole } = await render(LoginForm);

		const submitButton = getByRole("button", { name: "Login" });
		await expect.element(submitButton).toBeInTheDocument();
	});
});

// MARK: Navigation
describe("Navigation", () => {
	it("should display the wordmark SVG", async () => {
		const { getByRole } = await render(Navigation);

		const svg = getByRole("img");
		await expect.element(svg).toBeInTheDocument();
	});

	it("should display the navigation links", async () => {
		const { getByTestId } = await render(Navigation, { props: { menuItems: mockNavItems } });

		await expect.element(getByTestId("navigation-top")).toBeInTheDocument();
		await expect.element(getByTestId("navigation-menu")).toBeInTheDocument();

		for (const [index, item] of mockNavItems.entries()) {
			const desktopLink = getByTestId(`${item.icon}-t${index}`).element();
			const mobileLink = getByTestId(`${item.icon}-m${index}`).element();
			expect(desktopLink.textContent?.trim().endsWith(item.name)).toBe(true);
			expect(mobileLink.textContent?.trim().endsWith(item.name)).toBe(true);
		}
	});

	it("should render external links with target and rel attributes", async () => {
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

// MARK: Metadata
describe("Metadata", () => {
	it("should configure the correct metadata", async () => {
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

	it("should cope with optional metadata", async () => {
		await render(PageMetadata, {});

		expect(document.title).toBe(`| Tradao by ITea Lab™`);

		const metaDescription = document.querySelector('meta[name="description"]');
		expect(metaDescription).not.toBeInTheDocument();

		const metaKeywords = document.querySelector('meta[name="keywords"]');
		expect(metaKeywords).not.toBeInTheDocument();
	});
});

// MARK: Text Clock
describe("Text Clock", () => {
	it("should render the current date and time", async () => {
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

	it("should update time every minute", async () => {
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

// Dialogue
describe("Dialogue", () => {
	it.todo("should render children inside an open dialog");
	it.todo("should call onClose when Escape is pressed");
});

// MARK: Ev. Creation
describe("Event Creation Form", () => {
	it.todo("should render create-event fields and one survey row");
	it.todo("should add and remove survey question rows");
	it.todo("should call onSuccess after successful submission");
});

// MARK: Ev. Reg
describe("Event Registration Form", () => {
	it.todo("should render event and survey fields from props");
	it.todo("should render major questions with the major field control");
	it.todo("should display registration errors");
});

// MARK: Ev. Thumb
describe("Event Thumbnail Form", () => {
	it.todo("should render current and new thumbnail previews");
	it.todo("should preview a selected image file");
	it.todo("should reset preview after successful submission");
});

// MARK: Snackbar
describe("Snackbar", () => {
	it.todo("should display app-snackbar events with message and icon");
	it.todo("should remove its event listener when destroyed");
});

// MARK: Tk. Scanner
describe("Ticket Scanner", () => {
	it.todo("should report unsupported camera environments");
	it.todo("should reject invalid ticket QR codes");
	it.todo("should fetch and display a valid ticket");
	it.todo("should stop camera tracks when destroyed");
});

// MARK: Rm. Fields
describe("Remote Function Fields", () => {
	it.todo("should render LocalDatetime with field issues and notes");
	it.todo("should render Major with the available study majors");
	it.todo("should render Select options and selected value");
	it.todo("should render Text with custom icon and notes");
});
