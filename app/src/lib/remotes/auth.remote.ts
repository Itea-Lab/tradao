import { string } from "yup";
import { error, invalid } from "@sveltejs/kit";
import { command, form, getRequestEvent, query } from "$app/server";

import { loginSchema, userProfileSchema } from "#lib/validation.js";

export const inferOrganiserID = query(async () => {
	const sb = getRequestEvent().locals.supabase;

	const {
		data: { user },
		error: userError,
	} = await sb.auth.getUser();

	if (userError) error(userError.status || 500, userError.message);
	if (!user) error(404, "User not found");

	const profile = await getProfile(user.id);
	return profile.organiser_id;
});

export const getProfile = query(string().required().uuid(), async (id) => {
	const sb = getRequestEvent().locals.supabase;

	const {
		status,
		data: profile,
		error: queryError,
	} = await sb.from("profiles").select("*").eq("id", id).limit(1).single();

	if (queryError) error(status, queryError.message);
	if (!profile) error(404, "Profile not found");

	return profile;
});

export const updateProfile = form(userProfileSchema, async (profile) => {
	const sb = getRequestEvent().locals.supabase;

	const { status, error: dbError } = await sb
		.from("profiles")
		.update({
			display_name: profile.displayName,
		})
		.eq("id", profile.id);

	if (dbError) error(status, dbError.message);

	// https://github.com/orgs/supabase/discussions/20060
	const { error: authError } = await sb.auth.updateUser({
		data: {
			display_name: profile.displayName,
		},
	});

	if (authError) error(authError.status || 500, authError.message);

	void getProfile(profile.id).refresh();
	return {
		success: true,
		message: "Profile updated successfully",
	};
});

export const login = form(loginSchema, async ({ email, _password }) => {
	const sb = getRequestEvent().locals.supabase;

	const { error: signInError } = await sb.auth.signInWithPassword({
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
	const sb = getRequestEvent().locals.supabase;

	const { error: signOutError } = await sb.auth.signOut({
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
