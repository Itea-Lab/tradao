import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { error: signOutError } = await supabase.auth.signOut();

	if (signOutError) {
		return Response.json({ errors: [signOutError.message] }, { status: 500 });
	}

	return Response.json({ message: 'Successfully signed out' }, { status: 200 });
};
