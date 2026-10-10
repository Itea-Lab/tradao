import { describe, expect, it } from "vitest";
import { errorResponse, formatDate, serialiseDate, search, isEventUpcoming } from "$lib/utils";

describe('error response utility', () => {
	it('...should create a response with the correct status and message', () => {
		const response = errorResponse(404, 'Not Found');
		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toBe('application/json');
		return response.json().then(data => {
			expect(data).toEqual({ error: 'Not Found' });
		});
	});
});

describe('date serialisation utility', () => {
	it('...should serialise a Date object to an ISO string', () => {
		const date = new Date('2024-01-01T00:00:00Z');
		expect(serialiseDate(date)).toBe('2024-01-01T00:00:00.000Z');
	});

	it('...should serialise a date string to an ISO string', () => {
		const dateString = '2024-01-01T00:00:00Z';
		expect(serialiseDate(dateString)).toBe('2024-01-01T00:00:00.000Z');
	});
});

describe('date formatting utility (test in UTC+7)', () => {
	it('...should format a date string to a readable format', () => {
		const dateString = '2024-01-01T12:00:00Z';
		expect(formatDate(dateString)).toBe('01 Jan 2024, 19:00 GMT+7');
	});

	it('...should format a Date object to a readable format', () => {
		const date = new Date('2024-01-01T12:00:00Z');
		expect(formatDate(date)).toBe('01 Jan 2024, 19:00 GMT+7');
	});
});

describe('search utility', () => {
	it('...should return items that match the query in specified keys', () => {
		const data = [
			{ name: 'Alice', email: 'alice@example.com' },
			{ name: 'Bob', email: 'bob@example.com' }
		];
		const results = search(data, 'Alice', ['name']);
		expect(results).toEqual([{ name: 'Alice', email: 'alice@example.com' }]);
	});
});

describe('event date utility', () => {
	it('...should return true if the event is upcoming', () => {
		const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
		expect(isEventUpcoming(futureDate)).toBe(true);
	});

	it('...should return false if the event is in the past', () => {
		const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
		expect(isEventUpcoming(pastDate)).toBe(false);
	});
});
