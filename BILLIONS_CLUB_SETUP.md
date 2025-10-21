# Billions Club Platform - Complete Setup Guide

## Overview
Billions Club is a gamified platform where users play games, earn points, climb leaderboards, and interact in a moderated community chat.

## Features Implemented

### 1. **User Authentication & Profiles**
- Supabase Auth with email/password
- User profiles with levels, experience, and points
- Referral system with unique codes
- Avatar types (penguin/rabbit)
- Verification status tracking

### 2. **Leaderboards**
- Top 100 players by points
- Top 100 players by referrals
- Real-time rankings
- Verification badges

### 3. **Games & Points System**
- Multiple games with different rewards
- Points and experience rewards
- Level progression (max level 20)
- Experience multiplier based on level

### 4. **Community Chat**
- Real-time messaging
- Intelligent moderation bot that:
  - Filters offensive words
  - Removes links
  - Auto-bans users for 24 hours on violations
- Message history (last 50 messages)

### 5. **Referral System**
- Unique referral codes per user
- 200 bonus points for using referral code
- 200 points awarded to referrer
- Referral count tracking

## Database Setup

### Step 1: Run Migration Scripts
Execute these SQL scripts in order in your Supabase SQL Editor:

1. **001_create_tables.sql** - Creates all main tables and RLS policies
2. **002_create_profile_trigger.sql** - Creates trigger for profile creation
3. **003_create_leaderboard_views.sql** - Creates leaderboard views
4. **004_seed_games.sql** - Seeds initial games and bad words
5. **005_add_profile_fields.sql** - Adds additional profile fields

### Step 2: Verify Tables
Check that these tables exist in your Supabase database:
- `profiles` - User profiles with points, levels, referrals
- `chat_messages` - Community chat messages
- `chat_bans` - User bans for chat violations
- `games` - Available games
- `game_scores` - User game scores
- `bad_words` - Moderation word list

### Step 3: Verify Views
Check that these views exist:
- `leaderboard_points` - Top 100 by points
- `leaderboard_referrals` - Top 100 by referrals

## Environment Variables

Add these to your Vercel project (they should already be set from Supabase integration):

\`\`\`
SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supaSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=your_supabase_anon_key
SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000 (for development)
\`\`\`

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in user

### Leaderboards
- `GET /api/leaderboard/get-top-players?type=points&limit=100` - Get top players by points
- `GET /api/leaderboard/get-top-players?type=referrals&limit=100` - Get top players by referrals

### Chat
- `GET /api/chat/get-messages` - Get recent chat messages
- `POST /api/chat/send-message` - Send a chat message (with moderation)

### Games
- `GET /api/games/get-games` - Get available games
- `POST /api/games/submit-score` - Submit game score

### User
- `GET /api/user/get-profile` - Get user profile
- `POST /api/user/update-profile` - Update user profile

### Referrals
- `GET /api/referral/get-code` - Get user's referral code

## Frontend Pages

### Public Pages
- `/` - Home page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Pages (Require Authentication)
- `/dashboard` - Main dashboard with top players
- `/games` - Available games
- `/community` - Community chat with moderation
- `/leaderboards` - Global leaderboards (top 100)
- `/verification` - Human verification page

## Moderation System

### How It Works
1. User sends a message in community chat
2. Message is checked against:
   - Bad words list (case-insensitive)
   - Link detection (http://, https://, www.)
3. If violations found:
   - User is banned for 24 hours
   - Ban record is created in `chat_bans` table
   - User receives error message
4. If clean:
   - Message is sanitized (links removed, bad words replaced)
   - Message is stored in `chat_messages` table

### Bad Words List
Located in `scripts/004_seed_games.sql`. Add more words as needed:
\`\`\`sql
INSERT INTO public.bad_words (word, severity) VALUES
  ('your_word', 'high')
\`\`\`

## Leveling System

### Experience Calculation
- Base experience from games varies by game type
- Experience is adjusted by level multiplier: `1.1^(level-1)`
- Higher levels require more experience to level up
- Max level: 20

### Level Thresholds
- 1000 experience = 1 level up
- Experience resets after level up
- At level 20, experience stops accumulating

## Points System

### How Points Work
- Users start with 1000 points
- Referral bonus: +200 points (new user) and +200 points (referrer)
- Game rewards: 25-100 points depending on game
- Points are displayed on leaderboards

## Testing the Platform

### Test Sign Up
1. Go to `/auth/signup`
2. Create account with email and password
3. Choose avatar type (penguin or rabbit)
4. Optionally enter a referral code
5. Account created with 1000 points (or 1200 with referral)

### Test Games
1. Go to `/games`
2. Click on a game
3. Play and submit score
4. Points and experience awarded

### Test Community Chat
1. Go to `/community`
2. Send a normal message - should appear in chat
3. Try sending a message with a link - should be blocked and user banned
4. Try sending a message with bad words - should be blocked and user banned

### Test Leaderboards
1. Go to `/leaderboards`
2. Toggle between "Points Leaderboard" and "Referral Leaderboard"
3. Should show top 100 players in each category

## Troubleshooting

### Issue: "Unauthorized" errors
- Check that Supabase Auth is properly configured
- Verify environment variables are set correctly
- Check that user is logged in

### Issue: Leaderboards showing no data
- Verify migration scripts have been run
- Check that `leaderboard_points` and `leaderboard_referrals` views exist
- Ensure users have points/referrals in database

### Issue: Chat moderation not working
- Verify `bad_words` table is populated
- Check that `chat_bans` table exists
- Review moderation.ts for word list

### Issue: Database connection errors
- Verify Supabase URL and keys are correct
- Check that Supabase project is active
- Verify RLS policies are not blocking access

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Post-Deployment
1. Run migration scripts in production Supabase
2. Test all features on live site
3. Monitor error logs

## Future Enhancements

- [ ] Real-time chat with WebSockets
- [ ] More games and game types
- [ ] Achievements and badges
- [ ] User profiles and statistics
- [ ] Admin dashboard for moderation
- [ ] Seasonal leaderboards
- [ ] Tournaments and competitions
- [ ] Social features (friends, teams)
- [ ] Mobile app
- [ ] Payment integration for premium features

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check browser console for errors
4. Review server logs in Vercel
