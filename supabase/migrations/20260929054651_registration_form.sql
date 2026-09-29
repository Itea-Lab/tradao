-- Allow multiple types of event registration questions
CREATE TABLE IF NOT EXISTS question_types (
	slug CHARACTER VARYING(16) NOT NULL PRIMARY KEY,
	description TEXT
);

-- Add table and column descriptions for question_types
COMMENT ON TABLE question_types IS 'Types of questions in an event registration form.';

COMMENT ON COLUMN question_types.slug IS 'Unique identifier for the question type (e.g., "text", "multiple_choice", etc.).';
COMMENT ON COLUMN question_types.description IS 'Human-readable description of the question type.';

-- Populate the question_types table
INSERT INTO question_types (slug, description) VALUES
	('boolean', 'Checkbox yes/no'),
	('select', 'Select from a list'),
	('number', 'Numeric input'),
	('text', 'Text input'),
	('date', 'Date input'),
	('file', 'File input');

-- Each event have the static registration questions (name and email), along with dynamic questions
CREATE TABLE IF NOT EXISTS registration_questions (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	event_id UUID NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,

	-- `question_type` and `question_text to avoid using reserved keywords
	question_text TEXT NOT NULL,
	question_type CHARACTER VARYING(16) NOT NULL REFERENCES question_types(slug) ON DELETE RESTRICT,
	is_required BOOLEAN DEFAULT TRUE,

	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT registration_questions_pkey PRIMARY KEY (id)
);

-- Add table and column descriptions for registration_questions
COMMENT ON TABLE registration_questions IS 'Questions in an event registration form.';

COMMENT ON COLUMN registration_questions.event_id IS 'The ID of the event this question belongs to.';
COMMENT ON COLUMN registration_questions.question_type IS 'The type of the question (e.g., text, multiple choice, etc.)';
COMMENT ON COLUMN registration_questions.question_text IS 'The text of the question to be displayed to the user.';
COMMENT ON COLUMN registration_questions.is_required IS 'Indicates whether the question is required to be answered by the user.';

-- Each ticket can have answers to the registration questions
CREATE TABLE IF NOT EXISTS registration_answers (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	ticket_id UUID NOT NULL REFERENCES event_tickets(id) ON DELETE CASCADE,
	question_id UUID NOT NULL REFERENCES registration_questions(id) ON DELETE CASCADE,

	-- For simplicity all answers are stored as text
	-- Any future validation can rely on `question_type` in `registration_questions`
	answer_text TEXT,

	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT registration_answers_pkey PRIMARY KEY (id)
);

-- Add table and column descriptions for registration_answers
COMMENT ON TABLE registration_answers IS 'Answers to registration questions for each event ticket.';

COMMENT ON COLUMN registration_answers.ticket_id IS 'The ID of the ticket this answer belongs to.';
COMMENT ON COLUMN registration_answers.question_id IS 'The ID of the question this answer belongs to.';
COMMENT ON COLUMN registration_answers.answer_text IS 'The text of the answer provided by the user.';
COMMENT ON COLUMN registration_answers.created_at IS 'The timestamp when the answer was created.';
COMMENT ON COLUMN registration_answers.updated_at IS 'The timestamp when the answer was last updated.';
