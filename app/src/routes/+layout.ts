import type { LayoutLoad } from './$types';
import { SUPABASE_URL, SUPABASE_KEY } from "$app/env/public";
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(SUPABASE_URL, SUPABASE_KEY, {
			global: { fetch }
		})
		: createServerClient(SUPABASE_URL, SUPABASE_KEY, {
			global: { fetch },
			cookies: {
				getAll: () => data.cookies
			}
		});

	const { data: claimsData, error } = await supabase.auth.getClaims();
	const claims = error ? null : claimsData?.claims;

	return {
		claims,
		supabase,
	};
};
