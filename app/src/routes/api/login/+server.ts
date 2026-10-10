import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const formData = await request.json();
	const redirectTo = formData.redirectTo || '/manage';

	const { email, password } = formData;
	const { error: signInError } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (signInError) {
		return Response.json({ errors: [signInError.message] }, { status: 400 });
	}

	return Response.json({ redirectTo }, { status: 200 });
};
