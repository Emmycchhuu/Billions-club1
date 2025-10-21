# Billions Club - Complete Implementation Guide

## Environment Setup

You only need to add **2 environment variables** to your Vercel project:

1. **NEXT_PUBLIC_SUPABASE_URL** - Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Your Supabase anonymous key

### How to Get These Values:

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" and paste it as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Add these to your Vercel project's environment variables

## Features Implemented

### 1. Navigation System
- Global navigation component on all pages
- Mobile-responsive menu with hamburger icon
- Active page highlighting
- Sign out functionality

### 2. Referral System
- Users get 1200 points when signing up with a referral code (1000 + 200 bonus)
- Referrer gets 200 points when someone uses their code
- Referral code is unique per user (format: REF_XXXXX)
- Backend function `process_referral_bonus()` handles the logic

### 3. Spin Game Fix
- Fixed the logic so 2 matching toys correctly awards 50 points + 25 exp
- 3 matching toys award 100 points + 50 exp
- No match awards -10 points + 5 exp
- All rewards are properly applied

### 4. Leveling System
- Accurate experience calculation with 10% difficulty increase per level
- Max level: 20
- Base experience per level: 1000
- Formula: `expRequired = 1000 * 1.1^(level-1)`
- Experience is properly accumulated and level-ups are calculated correctly

### 5. Verification System
- Reduced to 15 math questions (removed voice verification)
- Two-step process: Math Challenge → Hold Button
- Verification badge awarded upon completion
- 500 experience points awarded for verification
- Verification status: pending → verified

### 6. Leaderboard
- Ranked by highest points (primary)
- Shows user profile pictures
- Displays verification badges
- Two leaderboard types: Points and Referrals
- Top 100 players displayed

### 7. Backend Logic
- All API routes use `process.env` for environment variables
- Middleware properly refreshes Supabase tokens
- Singleton pattern for Supabase clients (prevents errors)
- Row Level Security (RLS) policies protect user data
- Database functions handle complex operations safely

## Database Schema

The SQL script creates:
- **users** table with all user data
- **games** table with game definitions
- **game_results** table for tracking scores
- **referrals** table for referral tracking
- **Indexes** for optimal query performance
- **Functions** for safe data operations
- **Views** for leaderboards and statistics
- **RLS Policies** for security

## API Routes

### Leaderboard
- `GET /api/leaderboard/get-top-players?type=points&limit=100`
- Returns ranked players with profile pictures and verification status

### Referral
- `POST /api/referral/process-bonus`
- Body: `{ referralCode, newUserId }`
- Processes referral bonus and updates both users

### Games
- `POST /api/games/submit-score`
- Body: `{ userId, gameId, points, experience, result }`
- Records game result and updates user stats

## Middleware

The middleware (`middleware.ts`):
- Refreshes Supabase authentication tokens
- Sets cookies for session management
- Runs on all routes except static files
- Uses `process.env` for configuration

## Client vs Server

- **Client**: Uses `getSupabaseClient()` from `lib/supabase/client.ts`
- **Server**: Uses `getSupabaseServerClient()` from `lib/supabase/server.ts`
- Both use `process.env` for configuration
- Singleton pattern prevents multiple instances

## Running the SQL Script

1. Go to your Supabase project
2. Click on "SQL Editor"
3. Click "New Query"
4. Copy the entire content from `scripts/BILLIONS_CLUB_COMPLETE_SCHEMA.sql`
5. Paste it into the SQL editor
6. Click "Run"
7. Wait for completion (should take a few seconds)

## Testing the Features

### Test Referral System
1. Sign up with a referral code
2. Check that you got 1200 points
3. Verify the referrer got 200 bonus points

### Test Spin Game
1. Play the spin game
2. Get 2 matching toys - should show "Good Match! +50 points +25 exp"
3. Get 3 matching toys - should show "Perfect Match! +100 points +50 exp"

### Test Verification
1. Go to Verification page
2. Answer 15 math questions
3. Hold the button for 3 seconds
4. Get verification badge

### Test Leaderboard
1. Go to Leaderboards
2. Switch between Points and Referrals
3. Verify profile pictures display correctly
4. Check verification badges show for verified users

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you added both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding env vars

### API routes returning 500 errors
- Check that the SQL schema was run successfully
- Verify the environment variables are correct
- Check browser console for detailed error messages

### Leaderboard not showing profile pictures
- Make sure users have profile pictures uploaded to Supabase storage
- Check that the `profile_picture` column has the correct image URLs

## Next Steps

1. Add Supabase authentication (currently using mock auth)
2. Implement image upload for profile pictures
3. Add real-time updates using Supabase subscriptions
4. Implement chat functionality for community
5. Add more games and features
