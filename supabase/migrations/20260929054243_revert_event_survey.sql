-- Revert the previous migration to replace JSON column in favour of relational tables for survey questions and answers.
ALTER TABLE community_events
DROP COLUMN IF EXISTS survey_questions;

ALTER TABLE event_tickets
DROP COLUMN IF EXISTS survey_data;
