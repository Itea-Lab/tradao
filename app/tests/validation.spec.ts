import { describe, it, expect } from 'vitest';
import { eventID, participantName, participantEmail, thumbnail, eventCreationSchema, loginSchema } from "#lib/validation.js";
import { ValidationError } from 'yup';

describe('event ID and ticket ID', () => {
	it.each([
		crypto.randomUUID(),
		'00000000-0000-4000-8000-000000000001',
		'00000000-0000-4000-8000-000000000002',
		'00000000-0000-4000-8000-000000000003',
		'00000000-0000-4000-8000-000000000004',
		'00000000-0000-4000-8000-000000000005',
		'00000000-0000-4000-8000-000000000006',
		'00000000-0000-4000-8000-000000000007',
		'00000000-0000-4000-8000-000000000008',
		'00000000-0000-4000-8000-000000000009',
	])('accepts valid ID: %s', (id) => {
		eventID.validateSync(id);
		expect(eventID.isValidSync(id)).toBe(true);
	})

	it.each([
		'invalid-uuid',
		'',
		'not-a-uuid-at-all',
		'00000000-0000-0000-0000-0000000000000',
		'00000000-0000-4000-8000-00000000000g',
		'00000000-0000-4000-8000-00000000000',
		'00000000-0000-4000-8000-000000000000x',
		'00000000_0000_4000_8000_000000000000',
		'00000000-0000-4000-8000-00000000000z',
		'00000000-0000-4000-8000-00000000000!',
	])('rejects invalid ID: %s', (id) => {
		expect(() => eventID.validateSync(id)).toThrow(ValidationError);
	});
});

describe('participant name', () => {
	it.each([
		'Nguyễn Khánh Phúc Thịnh',
		'John Doe',
		'Élise Dupont',
		'María-José Carreño Quiñones',
		'Jürgen Müller',
		'Anne Marie',
		'Jean-Luc Picard',
		'Søren Kierkegaard',
		'Łukasz Żółć',
		'A',
	])('accepts Latin-based name: %s', (name) => {
		participantName.validateSync(name);
		expect(participantName.isValidSync(name)).toBe(true);
	});

	it.each([
		'John Doe123',
		'Jane @Doe!',
		'Alice 😊',
		'John_Doe',
		'Jane.Doe',
		"O'Connor",
		'Doe, Jane',
		'John/Doe',
		'Jane (Doe)',
		'Bob+Alice',
	])('rejects names with invalid characters: %s', (name) => {
		expect(() => participantName.validateSync(name)).toThrow(ValidationError);
	});

	it.each([
		'',
		'   ',
		'\t',
		'\n',
		'\r',
		' \t ',
		'\n\t',
		'\u00a0',
		'\u3000',
		' \n ',
	])('rejects empty or whitespace-only name: %s', (name) => {
		expect(() => participantName.validateSync(name)).toThrow(ValidationError);
	});
});

describe('participant email', () => {
	it.each([
		'john.doe@example.com',
		'jane.doe@university.edu',
	])('accepts valid email address: %s', (email) => {
		participantEmail.validateSync(email);
		expect(participantEmail.isValidSync(email)).toBe(true);
	});

	it.each([
		'not-an-email',
		'another@invalid..com',
		'\t',
		'\n',
		'Nguyen Ta Minh Triet',
		'+1 234 567 890',
		'2024-12-01T10:00',
		'2024-12-01T10:00Z',
		new File([], 'not-an-email'),
		'',
	])('rejects invalid email address: %s', (email) => {
		expect(() => participantEmail.validateSync(email)).toThrow(ValidationError);
	});
})

describe('event creation schema', () => {
	const validMockEvent = {
		title: 'Sample Event',
		slug: 'sample-event',
		description: 'This is a sample event for testing.',
		start_time: '2024-12-01T10:00',
		end_time: '2024-12-01T12:00',
		location: 'Online',
		category: 'Workshop',
		survey: [
			{
				question: 'What is the answer',
				type: 'text',
				options: [],
			}
		],
	};

	const invalidMockEvent = {
		title: '',
		slug: 'sample-event',
		description: 'This is a sample event for testing.',
		start_time: '2024-12-01T10:00:00Z',
		end_time: '2024-11-01T00:00:00Z',
		location: 'Online',
		category: 'Workshop',
		survey: [
			{
				question: '',
				type: '',
			}
		],
	};

	const invalidMockEvent2 = {
		...invalidMockEvent, start_time: '', end_time: '',
	}

	it('accepts valid event creation data', () => {
		eventCreationSchema.validateSync(validMockEvent);
		expect(eventCreationSchema.isValidSync(validMockEvent)).toBe(true);
	});

	it('rejects invalid event creation data', () => {
		expect(() => eventCreationSchema.validateSync(invalidMockEvent))
			.toThrow(ValidationError);
	});

	it('rejects event creation data with invalid dates', () => {
		expect(() => eventCreationSchema.validateSync(invalidMockEvent2))
			.toThrow(ValidationError);
	});
});

describe('event thumbnail', () => {
	it('accepts image file with valid type and size', () => {
		const validImageFile = new File(['dummy content'], 'event-image.jpg', { type: 'image/jpeg' });

		thumbnail.validateSync(validImageFile);
		expect(thumbnail.isValidSync(validImageFile)).toBe(true);
	});

	it('rejects image file with invalid type or size', () => {
		const invalidImageFile = new File(['dummy content'], 'event-image.txt', { type: 'text/plain' });
		expect(() => thumbnail.validateSync(invalidImageFile))
			.toThrow(ValidationError);
	});

	it('reject image file that is not a File at all', () => {
		const notAFile = { name: 'not-a-file.jpg', type: 'image/jpeg', size: 1024 };
		expect(() => thumbnail.validateSync(notAFile))
			.toThrow(ValidationError);
	});
});

describe('password login', () => {
	it.each([
		{ email: "ashoorbrooke0@accuweather.com", _password: "jK1&pL>IMb)" },
		{ email: "ebartlomiej1@blog.com", _password: "cD2}Z8@Pvy" },
		{ email: "cmaguire2@washingtonpost.com", _password: "aL6!njV'H" },
		{ email: "efauning3@barnesandnoble.com", _password: "oH2!8&+K" },
		{ email: "byaneev4@si.edu", _password: "qS8$a0pWZ" },
		{ email: "fmerry5@edublogs.org", _password: "cL0|`&4K+{!$H=" },
		{ email: "hvinall6@livejournal.com", _password: "gJ6\|g_p2" },
		{ email: "rconrard7@godaddy.com", _password: "pX0~I_SYNI" },
		{ email: "acarp8@paypal.com", _password: "rM1|QG<f,n" },
		{ email: "kernshaw9@etsy.com", _password: "aR8?Dyo*o~" },
	])('accepts valid $email with $_password', (form) => {
		loginSchema.validateSync(form);
		expect(loginSchema.isValidSync(form)).toBe(true);
	})
})
