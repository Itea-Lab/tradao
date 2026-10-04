/**
 * Utility function to create an error response for HTTP requests.
 * @param message Error message
 * @param status Status code, defaults to 500
 * @returns HTTP Response with error message
 */
export function errorResponse(
	status: number = 500,
	message: string | string[] = "Internal Server Error"
): Response {
	console.error('%d: %s', status, message);
	return new Response(
		JSON.stringify({ error: message }),
		{ status, headers: { 'Content-Type': 'application/json' } },
	);
}

/**
 * Utility function to serialise a date into an ISO string.
 * @param date Date object or string to be serialised
 * @returns ISO string representation of the date
 */
export function serialiseDate(date: Date | string): string {
	return new Date(date).toISOString();
}

/**
 * Format a date string into a more readable format.
 * @param date Date string or object to format
 * @param opts Optional Intl.DateTimeFormatOptions to customize the output format
 * @returns Formatted date string in (default) "dd MMM yyyy, HH:mm" format
 */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
	const options: Intl.DateTimeFormatOptions = opts || {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'Antarctica/Davis', // UTC+7
		timeZoneName: 'short',
	};
	return new Date(date).toLocaleString('en-AU', options);
}

/**
 * Searches through an array of objects for items that contain the query string in specified properties.
 *
 * @template T - The type of objects in the array
 * @param array - The array of objects to search through
 * @param query - The search string to look for (case-insensitive)
 * @param keys - An array of property keys to search within each object
 * @returns A filtered array containing only items that match the search criteria
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John Doe', email: 'john@example.com' },
 *   { name: 'Jane Smith', email: 'jane@example.com' }
 * ];
 * const results = search(users, 'john', ['name', 'email']);
 * // Returns: [{ name: 'John Doe', email: 'john@example.com' }]
 * ```
 */
export function search<T>(array: T[], query: string, keys: (keyof T)[]): T[] {
	const lowerQuery = query.toLowerCase();
	return array.filter((item) =>
		keys.some((key) => {
			const value = item[key];
			return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
		})
	);
}

export function isEventUpcoming(eventDate: string | Date): boolean {
	return new Date(eventDate) > new Date();
}
