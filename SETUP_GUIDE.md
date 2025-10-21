# Billions Club Platform - Complete Setup Guide

## Overview
This is a fully-featured gaming community platform with leaderboards, games, points system, leveling, community chat with moderation, and referral system.

## Features Implemented

### 1. Database Schema (Supabase)
- **Profiles Table**: User data with points, levels, experience, referrals
- **Chat Messages**: Community chat with moderation flags
- **Chat Bans**: 24-hour ban system for violations
- **Games**: Game definitions with point/XP rewards
- **Game Scores**: Track user game performance
- **Bad Words**: Moderation word list
- **Leaderboard Views**: Top 100 by points and referrals

### 2. Authentication
- Email/password signup and signin
- Automatic profile creation on signup
- Referral code generation
- Referral bonus system (1200 points for new users with referral code)

### 3. Leaderboards
- **Points Leaderboard**: Top 100 players by total points
- **Referrals Leaderboard**: Top 100 players by referral count
- Real-time ranking with medals for top 3

### 4. Community Chat
- Real-time messaging with Supabase
- **Moderation Bot Features**:
  - Automatic bad word filtering (replaces with asterisks)
  - Link detection and removal
  - 24-hour automatic ban for violations
  - Message sanitization before storage
- User verification badges
- Message timestamps

### 5. Games & Points System
- Multiple games with different rewards
- Points earned per game completion
- Experience system with level progression
- Max level: 20
- Experience threshold: 1000 XP per level
- Automatic level-up on experience gain

### 6. User Dashboard
- Real-time stats display (points, level, referrals, verification status)
- Experience progress bar
- Level progression tracking
- User profile management

## Environment Variables Required

Add these to your Vercel project (Connect > Vars):

\`\`\`
SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

## Database Migration Steps

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration scripts in order:
   - `scripts/001_create_tables.sql` - Main tables
   - `scripts/002_create_profile_trigger.sql` - Auto-create profiles
   - `scripts/003_create_views.sql` - Leaderboard views
   - `scripts/004_seed_games.sql` - Sample games and bad words
   - `scripts/005_create_chat_tables.sql` - Chat system
   - `scripts/006_create_profiles_table.sql` - Profiles table
   - `scripts/007_create_helper_functions.sql` - Helper functions

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login user

### Chat
- `POST /api/chat/send-message` - Send chat message (with moderation)
- `GET /api/chat/get-messages` - Fetch recent messages

### Games
- `POST /api/games/submit-score` - Submit game score
- `GET /api/games/get-games` - Get all games
- `GET /api/games/get-leaderboard` - Get game leaderboard

### User
- `GET /api/user/get-profile` - Get user profile
- `PUT /api/user/update-profile` - Update user profile

### Leaderboards
- `GET /api/leaderboard/get-top-players` - Get top players (points or referrals)

### Referrals
- `GET /api/referral/get-code` - Get user's referral code and link

### Health
- `GET /api/health` - Check API health

## Moderation System

### Bad Word Filtering
- Automatically detects and replaces bad words with asterisks
- Customizable word list in database
- Severity levels: high, medium

### Link Detection
- Blocks all HTTP/HTTPS links
- Blocks www links
- Replaces with "[link removed]"

### Ban System
- Automatic 24-hour ban on first violation
- Ban reason stored in database
- Users cannot send messages while banned
- Ban status checked on every message attempt

## Leveling System

### Experience Calculation
- Base XP from games varies by game type
- Experience multiplier based on current level (1.1x per level)
- Max level: 20
- Experience threshold: 1000 XP per level

### Level Progression
- Level 1: 0-999 XP
- Level 2: 1000-1999 XP
- Level 20: 19000+ XP (max)

## Points System

### Earning Points
- Starting points: 1000
- Referral bonus: +200 points (referrer), +200 points (new user)
- Game rewards: 40-100 points per game
- Points never decrease

### Leaderboard Ranking
- Ranked by total points
- Top 100 displayed
- Real-time updates

## Referral System

### How It Works
1. Each user gets unique referral code (REF_XXXXX)
2. Share referral link: `/auth/signup?ref=REF_XXXXX`
3. New user gets 1200 starting points (vs 1000)
4. Referrer gets +200 points and +1 referral count
5. Unlimited referrals possible

### Referral Leaderboard
- Top 100 by referral count
- Shows referral count and total points

## Security Features

### Row Level Security (RLS)
- All tables protected with RLS policies
- Users can only access their own data
- Public data (leaderboards, games) viewable by all
- Chat messages viewable by all, insertable only by authenticated users

### Authentication
- Supabase Auth handles password hashing
- Email confirmation required
- Session management via cookies
- Automatic token refresh

## Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Run database migrations in Supabase

## Testing

### Test Chat Moderation
- Try sending: "badword1" - should be filtered
- Try sending: "https://example.com" - should be removed
- Try sending: "offensive1" - should trigger 24-hour ban

### Test Games
- Submit score via `/api/games/submit-score`
- Check leaderboard updates
- Verify points and XP added to profile

### Test Referrals
- Get referral code from `/api/referral/get-code`
- Sign up with referral code
- Verify bonus points applied

## Troubleshooting

### Chat not loading
- Check Supabase connection
- Verify RLS policies are enabled
- Check browser console for errors

### Points not updating
- Verify game score submission endpoint
- Check profile update permissions
- Ensure user is authenticated

### Ban not working
- Check chat_bans table has data
- Verify ban_until timestamp is in future
- Clear browser cache and retry

## Future Enhancements

- Real-time chat with WebSockets
- More game types
- Achievement system
- Daily challenges
- Seasonal leaderboards
- Social features (friends, teams)
- Admin dashboard for moderation
