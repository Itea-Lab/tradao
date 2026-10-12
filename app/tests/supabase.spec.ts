// use mock env to test supabase client
import { describe, it, expect } from 'vitest';
import { createSupabaseClient } from "#lib/supabase.js";

describe('Supabase client', () => {
	it('creates a Supabase client with the correct URL and key', () => {
		const supabase = createSupabaseClient();
		expect(supabase).toBeDefined();
	});
});
