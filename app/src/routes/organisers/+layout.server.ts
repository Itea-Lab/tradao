import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { supabase }, url }) => {
	const { data, error: userError } = await supabase.auth.getUser();

	if (userError?.name === "AuthSessionMissingError") {
		console.warn("Redirecting to login");
		redirect(
			303,
			`/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`,
		);
	}

	if (userError) {
		console.error("Login error");
		error(userError.status || 500, userError.name);
	}

	return data;
};
