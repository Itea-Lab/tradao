import { invalid } from "@sveltejs/kit";
import { command, form, getRequestEvent } from "$app/server";

import { loginSchema } from "#lib/validation.js";

export const login = form(
	loginSchema,
	async ({ email, _password }) => {
		const { locals } = getRequestEvent();

		const { error: signInError } = await locals.supabase.auth
			.signInWithPassword({ email, password: _password });

		if (signInError) invalid(email, {
			message: signInError.message
		});

		return {
			success: true,
			message: 'Logged in successfully',
		};
	}
);

export const logout = command(async () => {
	const { locals } = getRequestEvent();

	const { error: signOutError } = await locals.supabase.auth
		.signOut({ scope: 'local' });

	if (signOutError) return {
		success: false,
		message: signOutError.message
	}

	return {
		success: true,
		message: 'Logged out successfully',
		redirectTo: '/login',
	};
});
