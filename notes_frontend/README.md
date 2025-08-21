# Personal Notes Frontend (React + Supabase)

A modern, minimalistic, responsive notes app with a sidebar, top bar, and main editor area.
Powered by React and Supabase.

## Environment Variables

Create a .env file in this folder (do not commit secrets) with:

REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key

These are required for the app to connect to Supabase.

## Local Development

1. Install dependencies:
   npm install

2. Run:
   npm start

3. Open http://localhost:3000

## Supabase Schema

Create a table named notes with the following columns:

- id: uuid (primary key, default value: gen_random_uuid() or uuid_generate_v4())
- title: text
- content: text
- tags: text[] (or jsonb if you prefer; update service implementation accordingly)
- created_at: timestamptz (default: now())
- updated_at: timestamptz (default: now())

Optionally add an updated_at trigger to auto-update timestamps.

If using RLS, ensure policies allow read/write for anon role as appropriate.

## Features

- Create, edit, delete notes
- Search across title, content, and tags
- Responsive layout: sidebar + main editor
- Light theme with modern styling

## Notes

- The UI handles missing env variables gracefully by showing an error banner when operations fail.
- The app is designed without heavy UI frameworks, relying on modern CSS for performance.
