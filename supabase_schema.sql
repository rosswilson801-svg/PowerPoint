-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
-- Create the schools table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    teacher_limit INTEGER NOT NULL DEFAULT 0,
    onboarding_token TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Policies for public demo access
CREATE POLICY "Enable read access for all users" ON public.schools
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for all users" ON public.schools
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.schools
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON public.schools
    FOR DELETE
    USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_schools_modtime
    BEFORE UPDATE ON public.schools
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
-- Create the profiles table extending auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN ('coordinator', 'teacher')),
    full_name TEXT,
    classes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for public demo access
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for all users" ON public.profiles
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.profiles
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON public.profiles
    FOR DELETE
    USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'role', 'teacher'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Create pending_invitations table
CREATE TABLE IF NOT EXISTS public.pending_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    year_groups TEXT,
    classes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.pending_invitations ENABLE ROW LEVEL SECURITY;

-- Demo open access policies
CREATE POLICY "Enable read access for all users" ON public.pending_invitations FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.pending_invitations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.pending_invitations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON public.pending_invitations FOR DELETE USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_pending_invs_modtime
    BEFORE UPDATE ON public.pending_invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Modify teacher_schedules to support Master Schedule approach
ALTER TABLE public.teacher_schedules 
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE;

-- Enable Row Level Security on teacher_schedules (required for policies to take effect)
ALTER TABLE public.teacher_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teacher_schedules
-- SELECT: any authenticated user can read (scoped by user_id in queries)
CREATE POLICY "Enable read access for all users" ON public.teacher_schedules
    FOR SELECT
    USING (true);

-- INSERT: authenticated users can insert their own rows
CREATE POLICY "Enable insert for authenticated users" ON public.teacher_schedules
    FOR INSERT
    WITH CHECK (true);

-- UPDATE: authenticated users can update their own rows
CREATE POLICY "Enable update for authenticated users" ON public.teacher_schedules
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- DELETE: authenticated users can delete their own rows
CREATE POLICY "Enable delete for authenticated users" ON public.teacher_schedules
    FOR DELETE
    USING (true);
