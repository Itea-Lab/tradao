import { describe, expect, it } from "vitest";
import { formatDate, serialiseDate, search, isEventUpcoming } from "#lib/utils.js";

describe('date serialisation utility', () => {
	it.each([
		['2024-01-01T00:00:00Z', '2024-01-01T00:00:00.000Z'],
		['2024-02-29T12:34:56Z', '2024-02-29T12:34:56.000Z'],
		['2024-03-10T23:45:00Z', '2024-03-10T23:45:00.000Z'],
		['2024-04-30T08:05:09.123Z', '2024-04-30T08:05:09.123Z'],
		['2024-05-15T08:30:00+02:00', '2024-05-15T06:30:00.000Z'],
		['2024-06-01', '2024-06-01T00:00:00.000Z'],
		['Tue, 02 Jul 2024 09:10:00 GMT', '2024-07-02T09:10:00.000Z'],
		['2024-08-09T22:59:59.999Z', '2024-08-09T22:59:59.999Z'],
		['2024-09-30T14:00:00-05:00', '2024-09-30T19:00:00.000Z'],
		['December 25, 2024 00:00 UTC', '2024-12-25T00:00:00.000Z'],
	])('should serialise %s to %s', (dateString, expected) => {
		expect(serialiseDate(dateString)).toBe(expected);
		expect(serialiseDate(new Date(dateString))).toBe(expected);
	});
});

describe('date formatting utility', () => {
	it.each([
		['2024-01-01T12:00:00Z', '01 Jan 2024, 19:00 GMT+7'],
		['2024-02-29T00:15:00Z', '29 Feb 2024, 07:15 GMT+7'],
		['2024-03-10T23:45:00Z', '11 Mar 2024, 06:45 GMT+7'],
		['2024-04-30T16:05:00Z', '30 Apr 2024, 23:05 GMT+7'],
		['2024-05-15T08:30:00+02:00', '15 May 2024, 13:30 GMT+7'],
		['2024-06-01', '01 June 2024, 07:00 GMT+7'],
		['Tue, 02 Jul 2024 09:10:00 GMT', '02 July 2024, 16:10 GMT+7'],
		['2024-08-09T22:59:59.999Z', '10 Aug 2024, 05:59 GMT+7'],
		['2024-09-30T14:00:00-05:00', '01 Oct 2024, 02:00 GMT+7'],
		['December 25, 2024 00:00 UTC', '25 Dec 2024, 07:00 GMT+7'],
	])('should format % to readable %s', (dateString, expected) => {
		expect(formatDate(dateString)).toBe(expected);
		expect(formatDate(new Date(dateString))).toBe(expected);
	});
});

describe('search utility', () => {
	it('should return items that match the query in specified keys', () => {
		const data = [
			{ name: 'Alice', email: 'alice@example.com' },
			{ name: 'Bob', email: 'bob@example.com' }
		];
		const results = search(data, 'Alice', ['name']);
		expect(results).toEqual([{ name: 'Alice', email: 'alice@example.com' }]);
	});
});

describe('event date utility', () => {
	it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('should return true if the event is upcoming (%i days)', (days) => {
		const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
		expect(isEventUpcoming(futureDate)).toBe(true);
	});

	it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('should return false if the event is in the past (%i days)', (days) => {
		const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
		expect(isEventUpcoming(pastDate)).toBe(false);
	});
});
