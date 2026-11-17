import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
	if (claimsError) error(claimsError.status || 500, claimsError.message);
	if (claimsData?.claims) return { claims: claimsData.claims };

	redirect(303, `/login?redirectTo=${encodeURIComponent('/organisers')}`);
};
