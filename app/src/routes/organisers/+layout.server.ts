import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { supabase }, url }) => {
	const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
	if (claimsError) error(claimsError.status || 500, claimsError.message);
	if (claimsData?.claims) return { claims: claimsData.claims };

	redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
};
