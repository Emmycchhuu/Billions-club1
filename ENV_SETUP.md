# Environment Variables Setup

You only need to add **2 environment variables** to your Vercel project:

## Required Environment Variables

1. **SUPABASE_NEXT_PUBLIC_SUPABASE_URL**
   - Get this from your Supabase project settings
   - Format: `https://[project-id].supabase.cSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY**
   - Get this from your Supabase project settings
   - This is the public anon key (safe to expose in frontend)

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Go to "Environment Variables"
4. Add the two variables above
5. Redeploy your project

## Database Setup

Run these SQL scripts in your Supabase SQL editor in this order:

1. `scripts/001_INIT_SCHEMA.sql` - Creates all tables and indexes
2. `scripts/002_GAME_FUNCTIONS.sql` - Creates game result functions
3. `scripts/003_STORAGE_SETUP.sql` - Sets up profile picture storage

That's it! Your backend is now fully configured.
