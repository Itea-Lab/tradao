import { classId, walletClient } from "#lib/googleWallet.js";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const response = await walletClient.genericobject
		.list({ classId });

	return { tickets: response.data.resources || [] };
}) satisfies PageServerLoad;
