# Supabase Configuration Guide

## Environment Variables
The following environment variables must be set in the .env file:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

## Database Schema Setup

Execute the following SQL in your Supabase SQL editor to set up the required table:

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    content TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for development
-- TODO: Replace with proper auth policies in production
CREATE POLICY "Allow anonymous access" ON notes
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);
```

## Required Setup Steps

1. Create a new Supabase project
2. Execute the SQL commands above in the SQL editor
3. Get your project URL and anon key from:
   - Project Settings -> API -> Project URL
   - Project Settings -> API -> Project API Keys -> anon/public key
4. Create a .env file in the notes_frontend directory with these values
5. Restart the React development server

## Authentication Setup (Optional)

If implementing auth later:

1. Enable desired auth providers in Authentication -> Providers
2. Update RLS policies to use auth.uid() instead of anonymous access
3. Add auth UI components from @supabase/auth-ui-react

## Development Notes

- The notes table uses TEXT[] for tags. If you prefer JSON, modify the schema and update notesService.js accordingly
- RLS is configured for anonymous access. Update policies when adding authentication
- The updated_at trigger ensures the timestamp updates automatically
- UUID is used for IDs to prevent enumeration attacks

## Troubleshooting

If operations fail:
1. Verify environment variables are set correctly
2. Check SQL editor logs for any schema errors
3. Test queries directly in the Table Editor
4. Verify RLS policies allow the desired operations
