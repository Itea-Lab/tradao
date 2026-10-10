import adapter from "@sveltejs/adapter-cloudflare";
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { webdriverio } from "@vitest/browser-webdriverio"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Detect if running in CI environment such as GitHub Actions
const isCI = process.env.CI === "true";

export default defineConfig({
	plugins: [sveltekit({
		adapter: adapter(),
		alias: {
			$components: "./src/components",
			$lib: "./src/lib",
		},
		preprocess: [vitePreprocess()]
	})],
	test: {
		browser: {
			enabled: true,
			instances: [{ browser: isCI ? "chrome" : "edge", headless: true }],
			provider: webdriverio(),
		},
		coverage: {
			clean: true,
			enabled: true,
			include: ["src/**/*.ts", "src/**/*.svelte"],
			provider: "v8",

			// Ensure consistent lcov coverage reports generation
			// for SonarCloud scanning in CI environments.
			reportOnFailure: true,
			reporter: ["text", "json", "html", "lcov"]
		},
		css: {
			modules: { classNameStrategy: "non-scoped" }
		},
		expect: { requireAssertions: true },
		environment: "node",
		include: ["tests/**/*.spec.ts"],
	},
});
