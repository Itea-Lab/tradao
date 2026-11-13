-- Reuse lookup tables as value helps for question_types

INSERT INTO question_types (slug, description) VALUES
	('academic_status', 'Academic status (e.g., undergraduate, graduate, etc.)'),
	('field_of_study', 'Field of study (e.g., Computer Science, Biology, etc.)');

-- Remove SQL views

DROP VIEW upcoming_events;
DROP VIEW tickets_with_event_details;

-- Remove old static fields in event_tickets

ALTER TABLE event_tickets
	DROP COLUMN student_id,
	DROP COLUMN academic_year,
	DROP COLUMN field_of_study,
	DROP COLUMN major,
	DROP COLUMN participate;
