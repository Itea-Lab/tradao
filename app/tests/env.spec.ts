import { describe, expect, it } from "vitest";
import { variables } from "../src/env";

describe("environment variables", () => {
	describe("SUPABASE_URL", () => {
		const validate = (value: string | undefined) =>
			variables.SUPABASE_URL.schema["~standard"].validate(value);

		it("accepts a Supabase URL", () => {
			expect(validate("https://project-ref.supabase.co")).toEqual({
				value: "https://project-ref.supabase.co",
			});
		});

		it.each([undefined, "", "not-a-url", "https://example.com"])(
			"rejects an invalid URL: %s",
			(value) => {
				expect(validate(value)).toHaveProperty("issues");
			},
		);
	});

	describe("SUPABASE_KEY", () => {
		const validate = (value: string | undefined) =>
			variables.SUPABASE_KEY.schema["~standard"].validate(value);

		it("accepts a publishable key", () => {
			expect(validate("sb_publishable_test-key")).toEqual({
				value: "sb_publishable_test-key",
			});
		});

		it.each([undefined, "", "invalid-key"])("rejects an invalid key: %s", (value) => {
			expect(validate(value)).toHaveProperty("issues");
		});
	});
});
