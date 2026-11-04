import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (
	{ locals: { safeGetSession }, url },
) => {
	const { user } = await safeGetSession();
	if (user) return { user };

	const redirectUrl = encodeURIComponent(url.pathname + url.search);
	redirect(303, `/login?redirectTo=${redirectUrl}`,);
};
