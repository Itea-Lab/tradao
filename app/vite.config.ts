import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { webdriverio } from "@vitest/browser-webdriverio"

// Detect if running in CI environment such as GitHub Actions
const isCI = process.env.CI === "true";

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		browser: {
			enabled: true,
			instances: [{ browser: isCI ? "chrome" : "edge", headless: true }],
			provider: webdriverio(),
		},
		coverage: {
			enabled: true,
			include: ["src/**/*.ts", "src/**/*.svelte"],
			provider: "v8",
		},
		css: {
			modules: { classNameStrategy: "non-scoped" }
		},
		expect: { requireAssertions: true },
		environment: "node",
		include: ["tests/**/*.spec.ts"],
	},
});
