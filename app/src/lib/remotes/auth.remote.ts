import { string } from "yup";
import { error, invalid } from "@sveltejs/kit";
import { command, form, getRequestEvent, query } from "$app/server";

import { loginSchema } from "#lib/validation.js";

export const getProfile = query(string().required().uuid(), async (id) => {
	const { locals } = getRequestEvent();

	const { data: profile, error: queryError } = await locals.supabase
		.from("profiles")
		.select("*")
		.eq("id", id)
		.limit(1)
		.single();

	if (queryError) error(500, queryError.message);
	if (!profile) error(404, "Profile not found");

	return profile;
});

export const login = form(loginSchema, async ({ email, _password }) => {
	const { locals } = getRequestEvent();

	const { error: signInError } = await locals.supabase.auth.signInWithPassword({
		email,
		password: _password,
	});

	if (signInError)
		invalid(email, {
			message: signInError.message,
		});

	return {
		success: true,
		message: "Logged in successfully",
	};
});

export const logout = command(async () => {
	const { locals } = getRequestEvent();

	const { error: signOutError } = await locals.supabase.auth.signOut({
		scope: "local",
	});

	if (signOutError)
		return {
			success: false,
			message: signOutError.message,
		};

	return {
		success: true,
		message: "Logged out successfully",
		redirectTo: "/login",
	};
});
