import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit/hooks';
import { SUPABASE_URL, SUPABASE_KEY } from "$app/env/public";
import type { Database } from '#lib/models.js';

export const handle: Handle = async ({ event, resolve }) => {
	/** Server-side Supabase client with cookie handling */
	event.locals.supabase = createServerClient<Database>(
		SUPABASE_URL,
		SUPABASE_KEY,
		{
			cookies: {
				getAll: () => {
					return event.cookies.getAll();
				},
				setAll: (cookiesToSet, headers) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});

					if (Object.keys(headers).length > 0) {
						event.setHeaders(headers);
					}
				},
			},
		}
	);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};
