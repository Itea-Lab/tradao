import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { createRawSnippet } from "svelte";
import { mockEvent, brokenEvent, longMockEvents, mockEvents, mockFooterProps, mockItems as mockNavItems } from "./_mock";

import Banner from "#components/Banner.svelte";
import Dialogue from "#components/Dialogue.svelte";
import EventCard from "#components/EventCard.svelte";
import EventCreationForm from "#components/EventCreationForm.svelte";
import EventRegistrationForm from "#components/EventRegistrationForm.svelte";
import EventsFeed from "#components/EventsFeed.svelte";
import EventThumbnailForm from "#components/EventThumbnailForm.svelte";
import Footer from "#components/Footer.svelte";
import LocalDatetime from "#components/remote_fields/LocalDatetime.svelte";
import LoginForm from "#components/LoginForm.svelte";
import Major from "#components/remote_fields/Major.svelte";
import Navigation from "#components/Navigation.svelte";
import PageMetadata from "#components/PageMetadata.svelte";
import Select from "#components/remote_fields/Select.svelte";
import Snackbar from "#components/Snackbar.svelte";
import Text from "#components/remote_fields/Text.svelte";
import TextClock from "#components/TextClock.svelte";
import TicketScanner from "#components/TicketScanner.svelte";
import { updateEventThumbnail } from "#lib/remotes/events.remote.js";
import { getTicket, registerEvent } from "#lib/remotes/tickets.remote.js";

const componentMocks = vi.hoisted(() => ({
	getTicket: vi.fn(),
	jsQR: vi.fn(),
}));

vi.mock("jsqr", () => componentMocks.jsQR);

vi.mock("#lib/remotes/events.remote.js", () => {
	function field() {
		let current = "";
		return {
			as: (type: string, value?: string) => ({
				name: "field",
				type,
				...(type === "file" ? {} : { value: value ?? current }),
			}),
			issues: () => undefined,
			value: () => current,
			set: (value: string | File) => { current = value as string; },
		};
	}

	const survey = new Proxy([], {
		get: (target, key) => {
			if (typeof key === "string" && /^\d+$/.test(key)) {
				return { type: field(), question: field() };
			}
			return Reflect.get(target, key);
		},
	});

	const title = field();
	const createEventFields = {
		title,
		start_time: field(),
		end_time: field(),
		location: field(),
		slug: field(),
		category: field(),
		description: field(),
		survey,
	};

	const createEvent = {
		fields: createEventFields,
		enhance: (handler: (form: {
			submit: () => Promise<boolean>;
			result: { success: boolean };
			element: HTMLFormElement;
			fields: { title: ReturnType<typeof field>; allIssues: () => undefined };
		}) => Promise<void>) => ({
			onsubmit: async (event: SubmitEvent) => {
				event.preventDefault();
				await handler({
					submit: async () => true,
					result: { success: true },
					element: event.currentTarget as HTMLFormElement,
					fields: { title, allIssues: () => undefined },
				});
			},
		}),
	};

	const thumbnail = field();
	const updateEventThumbnail = {
		fields: { eventID: field(), thumbnail },
		enhance: vi.fn((handler: (form: {
			submit: () => Promise<boolean>;
			result: { success: boolean };
			element: HTMLFormElement;
			fields: { allIssues: () => undefined };
		}) => Promise<void>) => ({
			onsubmit: async (event: SubmitEvent) => {
				event.preventDefault();
				await handler({
					submit: async () => true,
					result: { success: true },
					element: { reset: vi.fn() } as unknown as HTMLFormElement,
					fields: { allIssues: () => undefined },
				});
			},
		})),
	};

	return {
		createEvent,
		getEventQuestionTypes: vi.fn(async () => [
			{ slug: "short-text", description: "Short text" },
		]),
		updateEventThumbnail,
	};
});

vi.mock("#lib/remotes/tickets.remote.js", () => {
	function field() {
		return {
			as: (type: string, value?: string) => ({ name: "field", type, value }),
			issues: () => undefined,
		};
	}

	const surveyAnswers = new Proxy([], {
		get: (target, key) => {
			if (typeof key === "string" && /^\d+$/.test(key)) {
				return { questionID: field(), answer: field() };
			}
			return Reflect.get(target, key);
		},
	});

	return {
		getTicket: componentMocks.getTicket,
		registerEvent: {
			fields: {
				name: field(),
				email: field(),
				eventID: field(),
				surveyAnswers,
			},
				enhance: vi.fn((handler: (form: {
					submit: () => Promise<boolean>;
					fields: { allIssues: () => { message: string; path: string[] }[] };
				}) => Promise<void>) => ({
					onsubmit: async (event: SubmitEvent) => {
						event.preventDefault();
						await handler({
							submit: async () => false,
							fields: { allIssues: () => [{ message: "Invalid registration", path: [] }] },
						});
					},
				})),
		},
	};
});

afterEach(() => {
	componentMocks.getTicket.mockReset();
	componentMocks.jsQR.mockReset();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
	vi.useRealTimers();
});

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
		await expect.element(getByText("No events found.")).toBeInTheDocument();
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

		const noEventsMessage = getByText("No events found.");
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

	it("should allow toggling password visibility", async () => {
		const { getByLabelText, getByTestId } = await render(LoginForm);
		const passwordInput = getByLabelText("Password");
		const toggleButton = getByTestId("password-toggle");

		await expect.element(passwordInput).toHaveAttribute("type", "password");

		(toggleButton.element() as HTMLButtonElement).click();
		await expect.element(toggleButton).toHaveAttribute("aria-label", "Hide password");
		await expect.element(passwordInput).toHaveAttribute("type", "text");

		(toggleButton.element() as HTMLButtonElement).click();
		await expect.element(toggleButton).toHaveAttribute("aria-label", "Show password");
		await expect.element(passwordInput).toHaveAttribute("type", "password");
	})
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
	it("should render children inside an open dialog", async () => {
		const children = createRawSnippet(() => ({ render: () => "<p>Dialog content</p>" }));
		const { getByRole, getByText } = await render(Dialogue, { props: { children, onClose: vi.fn() } });

		await expect.element(getByRole("dialog")).toHaveAttribute("open");
		await expect.element(getByText("Dialog content")).toBeInTheDocument();
	});

	it("should call onClose when Escape is pressed", async () => {
		const onClose = vi.fn();
		const children = createRawSnippet(() => ({ render: () => "<p>Dialog content</p>" }));
		await render(Dialogue, { props: { children, onClose } });

		// Pressing Esc trigger onClose
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(onClose).toHaveBeenCalledOnce();

		// Pressing any other key does not
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Space" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "A" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "B" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "5" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Alt" }));
		expect(onClose).toHaveBeenCalledOnce();
	});
});

// MARK: Ev. Creation
describe("Event Creation Form", () => {
	it("should render create-event fields and one survey row", async () => {
		const { getByLabelText } = await render(EventCreationForm, { props: { onSuccess: vi.fn() } });

		await expect.element(getByLabelText("Title")).toBeInTheDocument();
		await expect.element(getByLabelText("Start Time")).toHaveAttribute("type", "datetime-local");
		await expect.element(getByLabelText("End Time")).toHaveAttribute("type", "datetime-local");
		await expect.element(getByLabelText("Question 1 Type")).toBeInTheDocument();
		await expect.element(getByLabelText("Question 1")).toBeInTheDocument();
		expect(document.querySelectorAll('input[id^="survey-question-"]')).toHaveLength(1);
	});

	it("should expose controls to add and remove survey questions", async () => {
		const { getByLabelText, getByRole } = await render(EventCreationForm, { props: { onSuccess: vi.fn() } });

		await expect.element(getByRole("button", { name: /Add Question/ })).toBeInTheDocument();
		await expect.element(getByRole("button", { name: "close" })).toBeInTheDocument();
		await expect.element(getByLabelText("Question 1 Type")).toBeInTheDocument();
		expect(document.querySelectorAll('input[id^="survey-question-"]')).toHaveLength(1);
	});

	it("should call onSuccess after successful submission", async () => {
		const onSuccess = vi.fn();
		const { getByRole } = await render(EventCreationForm, { props: { onSuccess } });

		(getByRole("button", { name: "Create Event" }).element() as HTMLButtonElement).click();

		await expect.poll(() => onSuccess.mock.calls.length).toBe(1);
	});
});

// MARK: Ev. Reg
describe("Event Registration Form", () => {
	const survey = [
		{
			id: "major-question",
			event_id: mockEvent.id,
			question_text: "What is your major?",
			question_type: "major",
			is_required: true,
			created_at: "2024-01-01",
			updated_at: "2024-01-01",
		},
		{
			id: "text-question",
			event_id: mockEvent.id,
			question_text: "What should we know?",
			question_type: "short-text",
			is_required: false,
			created_at: "2024-01-01",
			updated_at: "2024-01-01",
		},
	];

	it("should render event and survey fields from props", async () => {
		const { getByLabelText, getByRole } = await render(EventRegistrationForm, {
			props: { event: mockEvent, survey },
		});

		await expect.element(getByLabelText("Full name")).toBeInTheDocument();
		await expect.element(getByLabelText("Email address")).toBeInTheDocument();
		await expect.element(getByRole("textbox", { name: "Event" })).toHaveValue(mockEvent.title);
		await expect.element(getByLabelText("What is your major?")).toBeInTheDocument();
		await expect.element(getByLabelText("What should we know?")).toBeInTheDocument();
		expect(document.querySelector('input[hidden][name="field"]')).toBeInTheDocument();
	});

	it("should render major questions with the major field control", async () => {
		const { getByLabelText } = await render(EventRegistrationForm, {
			props: { event: mockEvent, survey },
		});

		await expect.element(getByLabelText("What is your major?")).toHaveAttribute("list", "majors");
		expect(document.querySelector("#majors")).toBeInTheDocument();
	});

	it("should display registration errors after submission", async () => {
		vi.mocked(registerEvent.enhance).mockClear();
		const { getByText } = await render(EventRegistrationForm, { props: { event: mockEvent, survey: [] } });
		expect(document.querySelector("section.error")).not.toBeInTheDocument();

		const submit = vi.mocked(registerEvent.enhance).mock.calls.at(-1)?.[0];
		await submit?.({
			submit: async () => false,
			fields: { allIssues: () => [{ message: "Invalid registration", path: [] }] },
		} as never);

		await expect.element(getByText("Invalid registration")).toBeInTheDocument();
	});
});

// MARK: Ev. Thumb
describe("Event Thumbnail Form", () => {
	it("should render current and new thumbnail previews", async () => {
		const { getByRole } = await render(EventThumbnailForm, { props: { event: mockEvent } });
		const currentThumbnail = getByRole("img", { name: `Thumbnail for ${mockEvent.title}` });
		const newThumbnail = getByRole("img", { name: "No new thumbnail selected" });

		await expect.element(currentThumbnail).toHaveAttribute("src", mockEvent.image);
		await expect.element(newThumbnail).toHaveAttribute("src", mockEvent.image);
	});

	it("should preview a selected image file", async () => {
		const { getByLabelText, getByRole } = await render(EventThumbnailForm, { props: { event: mockEvent } });
		const input = getByLabelText("Upload new image").element() as HTMLInputElement;
		const file = new File(["image data"], "thumbnail.png", { type: "image/png" });
		updateEventThumbnail.fields.thumbnail.set(file);
		vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(function (this: FileReader) {
			this.onload?.({ target: { result: "data:image/png;base64,aW1hZ2U=" } } as ProgressEvent<FileReader>);
		});
		Object.defineProperty(input, "files", { configurable: true, value: [file] });
		input.dispatchEvent(new Event("change", { bubbles: true }));

		const preview = getByRole("img", { name: "New thumbnail preview" });
		await expect.element(preview).toHaveAttribute("src", "data:image/png;base64,aW1hZ2U=");
	});

	it("should reset preview after successful submission", async () => {
		const { getByLabelText, getByRole } = await render(EventThumbnailForm, { props: { event: mockEvent } });
		const input = getByLabelText("Upload new image").element() as HTMLInputElement;
		vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(function (this: FileReader) {
			this.onload?.({ target: { result: "data:image/png;base64,aW1hZ2U=" } } as ProgressEvent<FileReader>);
		});
		updateEventThumbnail.fields.thumbnail.set(
			new File(["image data"], "thumbnail.png", { type: "image/png" }),
		);
		Object.defineProperty(input, "files", {
			configurable: true,
			value: [new File(["image data"], "thumbnail.png", { type: "image/png" })],
		});
		input.dispatchEvent(new Event("change", { bubbles: true }));
		await expect.element(getByRole("img", { name: "New thumbnail preview" })).toBeInTheDocument();

		const submit = vi.mocked(updateEventThumbnail.enhance).mock.calls.at(-1)?.[0];
		await submit?.({
			submit: async () => true,
			result: { success: true },
			element: { reset: vi.fn() } as unknown as HTMLFormElement,
			fields: { allIssues: () => undefined },
		} as never);

		await expect.element(getByRole("img", { name: "No new thumbnail selected" })).toHaveAttribute("src", mockEvent.image);
	});
});

// MARK: Snackbar
describe("Snackbar", () => {
	it.each([
		{ icon: "info", className: "primary active" },
		{ icon: "error", className: "error active" },
	])("should display $icon app-snackbar events with message and icon", async ({ icon, className }) => {
		vi.stubGlobal("ui", vi.fn());
		const { getByRole } = await render(Snackbar);

		window.dispatchEvent(new CustomEvent("app-snackbar", {
			detail: { message: "Saved successfully", icon, duration: 5000 }
		}));

		const snackbar = getByRole("status");
		await expect.element(snackbar.element().querySelector("span")!).toHaveTextContent("Saved successfully");
		await expect.element(snackbar).toHaveClass(className);
		await expect.element(snackbar.element().querySelector("i")!).toHaveTextContent(icon);
		vi.unstubAllGlobals();
	});

	it("should remove its event listener when destroyed", async () => {
		const removeEventListener = vi.spyOn(window, "removeEventListener");
		const { unmount } = await render(Snackbar);

		unmount();

		expect(removeEventListener).toHaveBeenCalledWith("app-snackbar", expect.any(Function));
		removeEventListener.mockRestore();
	});
});

// MARK: Tk. Scanner
describe("Ticket Scanner", () => {
	it("should report unsupported camera environments", async () => {
		vi.stubGlobal("navigator", { mediaDevices: undefined });
		const { getByText } = await render(TicketScanner);

		await expect.element(getByText("Error: Camera not supported in this environment.")).toBeInTheDocument();
	});

	it("should reject invalid ticket QR codes", async () => {
		componentMocks.getTicket.mockRejectedValueOnce({ body: { message: "Ticket not found" } });
		const { getByText } = await renderTicketScanner({ qrData: "invalid-ticket" });

		await expect.element(getByText("Error: Ticket not found")).toBeInTheDocument();
		expect(getTicket).toHaveBeenCalledWith("invalid-ticket");
	});

	it("should fetch and display a valid ticket", async () => {
		const ticket = {
			id: "ticket-1",
			event_id: mockEvent.id,
			name: "Sample Participant",
			email: "participant@example.com",
			created_at: "2024-01-01",
			updated_at: "2024-01-01",
		};
		componentMocks.getTicket.mockResolvedValueOnce(ticket);
		const { getByText } = await renderTicketScanner({ qrData: ticket.id });

		await expect.element(getByText(`Ticket found: ${ticket.name}`)).toBeInTheDocument();
	});

	it("should stop camera tracks when destroyed", async () => {
		const track = { stop: vi.fn() } as unknown as MediaStreamTrack;
		const stream = new MediaStream();
		vi.spyOn(stream, "getTracks").mockReturnValue([track]);
		vi.stubGlobal("navigator", {
			mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) },
		});
		const { unmount } = await render(TicketScanner);
		await vi.waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledOnce());

		unmount();

		expect(track.stop).toHaveBeenCalledOnce();
	});
});

async function renderTicketScanner({ qrData }: { qrData: string }) {
	const stream = new MediaStream();
	vi.stubGlobal("navigator", {
		mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) },
	});

	let scan: FrameRequestCallback | undefined;
	vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
		scan = callback;
		return 1;
	}));
	vi.stubGlobal("cancelAnimationFrame", vi.fn());
	componentMocks.jsQR.mockReturnValue({ data: qrData });

	vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
		drawImage: vi.fn(),
		getImageData: vi.fn(() => ({ data: new Uint8ClampedArray() })),
	} as unknown as CanvasRenderingContext2D);

	const result = await render(TicketScanner);
	const video = document.querySelector("video")!;
	Object.defineProperties(video, {
		readyState: { configurable: true, value: video.HAVE_ENOUGH_DATA },
		videoWidth: { configurable: true, value: 2 },
		videoHeight: { configurable: true, value: 2 },
	});
	scan?.(0);
	await new Promise((resolve) => setTimeout(resolve, 850));
	return result;
}

// MARK: Rm. Fields
describe("Remote Function Fields", () => {
	function field(issues?: { message: string; path: string[] }[], selectedValue = "") {
		let current = selectedValue;
		return {
			as: (type: string, value?: string) => ({ type, value: value ?? current }),
			issues: () => issues,
			value: () => current,
			set: (value?: string) => {
				current = value ?? "";
				return current;
			},
			touched: () => false,
			dirty: () => false,
		};
	}

	it("should render LocalDatetime with field issues and notes", async () => {
		const { getByLabelText, getByText } = await render(LocalDatetime, {
			props: {
				id: "start-time",
				label: "Start time",
				notes: "Choose local time",
				field: field([{ message: "Required", path: ["start_time"] }]) as never,
			},
		});

		await expect.element(getByLabelText("Start time")).toHaveAttribute("type", "datetime-local");
		await expect.element(getByText("Choose local time")).toBeInTheDocument();
		await expect.element(getByText("Required")).toBeInTheDocument();
	});

	it("should render Major with the available study majors", async () => {
		const { getByLabelText } = await render(Major, {
			props: { id: "study-major", label: "Study major", field: field() as never },
		});

		await expect.element(getByLabelText("Study major")).toHaveAttribute("list", "majors");
		expect(document.querySelectorAll("#majors option")).toHaveLength(5);
	});

	it("should render Select options and selected value", async () => {
		const { getByLabelText } = await render(Select, {
			props: {
				id: "attendance",
				label: "Attendance",
				field: field(undefined, "online") as never,
				options: [
					{ value: "in-person", label: "In person" },
					{ value: "online", label: "Online" },
				],
			},
		});
		const select = getByLabelText("Attendance");

		await expect.element(select).toHaveValue("online");
		expect(Array.from(select.element().querySelectorAll("option"), (option) => option.textContent)).toEqual([
			"Select an option",
			"In person",
			"Online",
		]);
	});

	it("should render Text with custom icon and notes", async () => {
		const { getByLabelText, getByText } = await render(Text, {
			props: {
				id: "organization",
				icon: "groups",
				label: "Organization",
				notes: "Use your team name",
				field: field() as never,
			},
		});

		await expect.element(getByLabelText("Organization")).toHaveAttribute("type", "text");
		await expect.element(getByText("groups")).toBeInTheDocument();
		await expect.element(getByText("Use your team name")).toBeInTheDocument();
	});
});
