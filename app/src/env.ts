import { string } from "yup";
import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
	SUPABASE_URL: {
		public: true,
		static: true,
		description: "URL of the Supabase instance",
		schema: (value) =>
			string()
				.required()
				.url("Must be a valid URL")
				.test({
					name: "is-supabase",
					test: (value) => value.endsWith(".supabase.co"),
					message: ({ value }) => `${value} is not a Supabase URL`,
				})
				.validateSync(value),
	},

	SUPABASE_KEY: {
		public: true,
		static: true,
		description: "Publishable key to access the Supabase instance",
		schema: (value) =>
			string()
				.required()
				.test({
					name: "is-publishable",
					test: (value) => value.startsWith("sb_publishable_"),
					message: ({ value }) => `${value} is not a publisable key`,
				})
				.validateSync(value),
	},
});
