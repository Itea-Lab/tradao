import { createSupabaseClient } from '#lib/supabase.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return {
		session,
		user: data.user,
		supabase,
	};
};
