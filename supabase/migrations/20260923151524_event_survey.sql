BEGIN;

-- Add a JSON column to store survey questions for an event.
ALTER TABLE community_events
ADD COLUMN survey_questions JSONB;

-- Validate with extensions.jsonb_matches_schema as equivalent to TypeScript:
-- {
--   id: string;
--   question: string;
--   type: 'text' | 'multiple_choice' | 'rating';
-- }[]
ALTER TABLE community_events
ADD CONSTRAINT survey_questions_schema CHECK (
	extensions.jsonb_matches_schema(
		'{
			"type": "array",
			"items": {
				"type": "object",
				"properties": {
					"id": { "type": "string" },
					"question": { "type": "string" },
					"type": { "type": "string", "enum": ["text", "multiple_choice", "rating"] }
				},
				"required": ["id", "question", "type"]
			}
		}',
		survey_questions
	)
);

-- Add a JSON column to store survey information of an event participant.
ALTER TABLE event_tickets
ADD COLUMN survey_data JSONB;

-- Validate with extensions.jsonb_matches_schema as equivalent to TypeScript:
-- {
--   id: string;
--   answer: string | string[] | number;
-- }[]
ALTER TABLE event_tickets
ADD CONSTRAINT survey_data_schema CHECK (
	extensions.jsonb_matches_schema(
		'{
			"type": "array",
			"items": {
				"type": "object",
				"properties": {
					"id": { "type": "string" },
					"answer": {
						"oneOf": [
							{ "type": "string" },
							{ "type": "array", "items": { "type": "string" } },
							{ "type": "number" }
						]
					}
				},
				"required": ["id", "answer"]
			}
		}',
		survey_data
	)
);

COMMIT;
