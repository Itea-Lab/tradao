import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";

import { longMockEvents } from "./_mock";
import HomePage from "../src/routes/+page.svelte";
import ErrorPage from "../src/routes/+error.svelte";
import { createSupabaseClient } from "$lib/supabase";

describe("Home page (/)", () => {
	it("should render the home page component", async () => {
		const { container } = render(HomePage, {
			data: { events: longMockEvents, supabase: createSupabaseClient(), session: null, user: null }
		});

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
