import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";

import HomePage from "../src/routes/+page.svelte";
import ErrorPage from "../src/routes/+error.svelte";
import LoginPage from "../src/routes/login/+page.svelte";
import AboutPage from "../src/routes/about/+page.svelte";
import CalendarPage from "../src/routes/calendar/+page.svelte";

describe("Home page (/)", () => {
	it("should render the home page component", async () => {
		const { container } = await render(HomePage);

		await expect.element(container).toBeInTheDocument();
	});
});

describe("Login page (/login)", () => {
	it("should render the login page component", async () => {
		const { container } = await render(LoginPage);

		await expect.element(container).toBeInTheDocument();
	});
});

describe("About page (/about)", () => {
	it("should render the about page component", async () => {
		const { container } = await render(AboutPage);

		await expect.element(container).toBeInTheDocument();
	});
});

describe("Calendar page (/calendar)", () => {
	it("should render the calendar page component", async () => {
		const { container } = await render(CalendarPage);

		await expect.element(container).toBeInTheDocument();
	});
});

describe("Error page (/+error.svelte)", () => {
	it("should render the error page component", async () => {
		render(ErrorPage);

		const errorIcon = page.getByTestId("error-icon");
		const errorStatus = page.getByTestId("error-status");
		const errorMessage = page.getByTestId("error-message");

		await expect.element(errorIcon).toBeInTheDocument();
		await expect.element(errorStatus).toBeInTheDocument();
		await expect.element(errorMessage).toBeInTheDocument();
	});
});
