import { Constants } from "#lib/models.js";
import { describe, expect, it } from "vitest";

describe('Database constants', () => {
	it('should not have any GraphQL enums defined by now', () => {
		expect(Constants.graphql_public.Enums).toEqual({
			// No GraphQL enums defined yet
		});
	});

	it('should currently covers three fields of study', () => {
		expect(Constants.public.Enums.field_of_study).toHaveLength(3);
	});
});
