import { describe, it, expect } from 'vitest';
import { eventID, participantName, participantEmail, eventImageFile, eventCreationSchema } from "$lib/validation";
import type { Tables } from '$lib/models';

describe('event registration schema test', () => {
	it('initially accepts valid event IDs', () => {
		const validUUIDv4 = '123e4567-e89b-12d3-a456-426614174000';
		expect(eventID.isValidSync(validUUIDv4)).toBe(true);
	})

	it('rejects invalid event IDs', () => {
		const invalidUUID = 'invalid-uuid';
		expect(eventID.isValidSync(invalidUUID)).toBe(false);

		const emptyString = '';
		expect(eventID.isValidSync(emptyString)).toBe(false);
	});

	it('accepts Latin-based name for participant name', () => {
		const nameVietnamese = 'Nguyễn Khánh Phúc Thịnh';
		expect(participantName.isValidSync(nameVietnamese)).toBe(true);

		const nameEnglish = 'John Doe';
		expect(participantName.isValidSync(nameEnglish)).toBe(true);

		const nameFrench = 'Élise Dupont';
		expect(participantName.isValidSync(nameFrench)).toBe(true);

		const nameSpanish = 'María-José Carreño Quiñones';
		expect(participantName.isValidSync(nameSpanish)).toBe(true);

		const nameGerman = 'Jürgen Müller';
		expect(participantName.isValidSync(nameGerman)).toBe(true);
	});

	it('rejects names with invalid characters for participant name', () => {
		const nameWithNumbers = 'John Doe123';
		expect(participantName.isValidSync(nameWithNumbers)).toBe(false);

		const nameWithSpecialChars = 'Jane @Doe!';
		expect(participantName.isValidSync(nameWithSpecialChars)).toBe(false);

		const nameWithEmojis = 'Alice 😊';
		expect(participantName.isValidSync(nameWithEmojis)).toBe(false);
	});

	it('rejects participant name that is empty or whitespace-only', () => {
		const emptyName = '';
		expect(participantName.isValidSync(emptyName)).toBe(false);

		const whitespaceName = '   ';
		expect(participantName.isValidSync(whitespaceName)).toBe(false);
	});

	it('accepts valid email formats for participant email', () => {
		const validEmail1 = 'john.doe@example.com';
		expect(participantEmail.isValidSync(validEmail1)).toBe(true);

		const validEmail2 = 'jane.doe@university.edu';
		expect(participantEmail.isValidSync(validEmail2)).toBe(true);
	});

	it('rejects invalid email formats for participant email', () => {
		const invalidEmail1 = 'not-an-email';
		expect(participantEmail.isValidSync(invalidEmail1)).toBe(false);

		const invalidEmail2 = 'another@invalid..com';
		expect(participantEmail.isValidSync(invalidEmail2)).toBe(false);
	});
});

describe('event creation schema test', () => {
	const validMockEvent: Tables<'community_events'> = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		title: 'Sample Event',
		slug: 'sample-event',
		organiser_id: '123e4567-e89b-12d3-a456-426614174000',
		description: 'This is a sample event for testing.',
		start_time: '2024-12-01T10:00:00Z',
		end_time: '2024-12-01T12:00:00Z',
		location: 'Online',
		category: 'Workshop',
		image: 'https://example.com/event-image.jpg',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};

	const invalidMockEvent: Tables<'community_events'> = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		title: '',
		slug: 'sample-event',
		organiser_id: '123e4567-e89b-12d3-a456-426614174000',
		description: 'This is a sample event for testing.',
		start_time: '2024-12-01T10:00:00Z',
		end_time: '2024-11-01T00:00:00Z',
		location: 'Online',
		category: 'Workshop',
		image: 'https://example.com/event-image.jpg',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};

	const invalidMockEvent2: Tables<'community_events'> = {
		...invalidMockEvent, start_time: '', end_time: '',
	}

	it('accepts valid event creation data', () => {
		expect(eventCreationSchema.isValidSync(validMockEvent)).toBe(true);
	});

	it('rejects invalid event creation data', () => {
		expect(eventCreationSchema.isValidSync(invalidMockEvent)).toBe(false);
	});

	it('rejects event creation data with invalid dates', () => {
		expect(eventCreationSchema.isValidSync(invalidMockEvent2)).toBe(false);
	});

	it('accepts image file with valid type and size', () => {
		const validImageFile = new File(['dummy content'], 'event-image.jpg', { type: 'image/jpeg' });
		expect(eventImageFile.isValidSync(validImageFile)).toBe(true);
	});

	it('rejects image file with invalid type or size', () => {
		const invalidImageFile = new File(['dummy content'], 'event-image.txt', { type: 'text/plain' });
		expect(eventImageFile.isValidSync(invalidImageFile)).toBe(false);
	});

	it('reject image file that is not a File at all', () => {
		const notAFile = { name: 'not-a-file.jpg', type: 'image/jpeg', size: 1024 };
		expect(eventImageFile.isValidSync(notAFile)).toBe(false);
	});
});
