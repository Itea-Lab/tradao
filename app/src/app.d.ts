// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '#lib/models.js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		interface PageState {
			/** ID of the currently open dialog */
			dialog: string | null;

			/** ID of the currently focused item (for edit/delete dialogs) */
			itemID: string | null;
		}
		// interface Platform {}
	}
}

export {};
