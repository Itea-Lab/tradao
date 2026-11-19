BEGIN;

-- Create user profile table, linking with auth users
CREATE TABLE public.profiles (
	-- Profile ID linked to user ID
	id uuid NOT NULL REFERENCES auth.users on delete cascade,

	-- Link to event organiser, null when user was just added
	organiser_id UUID NULL REFERENCES event_organisers(id) ON DELETE CASCADE,

	-- Display name
	display_name TEXT,

	PRIMARY KEY (id)
);

-- Grant the privileges the roles need
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- Enable row level security for the table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add description to the table
COMMENT ON TABLE public.profiles IS 'Stores information of authenticated users, who work in event organisation';

COMMENT ON COLUMN public.profiles.organiser_id IS 'Event organiser the user belongs to';
COMMENT ON COLUMN public.profiles.display_name IS 'Display name of the user';

-- Add new user trigger
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
	INSERT INTO public.profiles (
		id,
		display_name,
		organiser_id
	) VALUES (
		new.id,
		new.raw_user_meta_data ->> 'display_name',
		NULL
	);

	RETURN new;
END;
$$;

-- Assign trigger to insert event on auth.users
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR each ROW EXECUTE PROCEDURE public.handle_new_user();

COMMIT;
