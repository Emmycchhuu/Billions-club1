-- ============================================================================
-- BILLIONS CLUB - COMPLETE DATABASE SETUP
-- Run this SINGLE file in Supabase SQL Editor
-- No conflicts, no errors, no policy issues
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 1000,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  profile_picture_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_reward INTEGER DEFAULT 100,
  experience_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game results table
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  points_earned INTEGER DEFAULT 0,
  experience_earned INTEGER DEFAULT 0,
  result_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  category TEXT DEFAULT 'billions',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Verification attempts table
CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questions_passed INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results(user_id);
CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_verification_user_id ON verification_attempts(user_id);

-- ============================================================================
-- 3. INSERT GAMES
-- ============================================================================

INSERT INTO games (name, description, points_reward, experience_reward) VALUES
  ('Impostor', 'Find the impostor among the group', 100, 50),
  ('Spin', 'Match the spinning toys', 100, 50),
  ('Quiz', 'Answer Billions Network questions', 100, 50)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. INSERT QUIZ QUESTIONS (50 TOTAL - 25 from each set)
-- ============================================================================

-- First set of 25 questions
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, category) VALUES
('What does Billions Network aim to build across humans and AI?', 'A decentralized trust infrastructure', 'A global social media system', 'A centralized verification model', 'A digital ad network', 'A', 'billions'),
('Which layer is responsible for storing verified reputations on Billions?', 'Privacy Mesh', 'Token Layer', 'Social Graph', 'Reputation Layer', 'D', 'billions'),
('What gives Billions its identity verification advantage?', 'It uses decentralized attestations from Sign Protocol', 'It relies on government-issued IDs', 'It uses centralized face scanning', 'It integrates KYC APIs', 'A', 'billions'),
('How does Billions protect user data during verification?', 'Using distributed hashes', 'Through ZK-Encryption', 'Through Zero-Knowledge Proofs', 'Through cloud encryption', 'C', 'billions'),
('Which blockchain primarily powers Billions verification ecosystem?', 'Ethereum Layer via Sign Protocol', 'Solana Runtime', 'Avalanche Core', 'Polkadot Relay', 'A', 'billions'),
('Which term describes the process of confirming an action''s authenticity in Billions?', 'Proof of Identity', 'Reputation Match', 'Proof of Integrity', 'Data Binding', 'C', 'billions'),
('What makes Billions sybil-resistant?', 'Each verified user has a unique attestation identity', 'It limits wallet creation', 'It uses 2FA login', 'It verifies social followers', 'A', 'billions'),
('What''s the function of Zero-Knowledge Proofs in Billions?', 'They allow truth verification without revealing private data', 'They increase blockchain speed', 'They replace tokens with NFTs', 'They automate staking', 'A', 'billions'),
('What key feature links humans and AI within Billions?', 'Unified Reputation Ledger', 'Neural Token Stream', 'Social Reputation Rank', 'Layer-2 Graph', 'A', 'billions'),
('Who co-develops AI identity systems with Billions?', 'Sentient', 'Anthropic', 'OpenAI', 'Google DeepMind', 'D', 'billions'),
('What mechanism prevents double verification on Billions?', 'Attestation Hash Matching', 'Smart Proof Token', 'ID Rebinding', 'Device Sync Lock', 'B', 'billions'),
('What does "Proof of Humanity" establish in Billions?', 'That an entity is human without exposing private data', 'That a user owns tokens', 'That a wallet is verified by banks', 'That an address is whitelisted', 'A', 'billions'),
('What role does Sign Protocol play in Billions'' system?', 'It powers decentralized attestations for identity', 'It handles storage encryption', 'It maintains off-chain user data', 'It provides token liquidity', 'A', 'billions'),
('What term refers to the connection between verified identities and reputation actions?', 'Trust Graph', 'Node Chain', 'Attestation Loop', 'Proof Set', 'D', 'billions'),
('What prevents data tampering in Billions'' reputation logs?', 'Blockchain immutability', 'Manual validation', 'IP tracking', 'Smart contract pausing', 'A', 'billions'),
('What is the purpose of the "Global Trust Economy" in Billions?', 'To create verified value exchange across the ecosystem', 'To support influencer marketing', 'To host NFT markets', 'To fund mining operations', 'A', 'billions'),
('Which component enables AI agents to hold verified identities?', 'Proof Agent ID', 'Attestation Layer', 'Digital Avatar System', 'Synthetic Soul Tag', 'B', 'billions'),
('How does Billions support creators through "Billions x Camp"?', 'By helping them tokenize verified IP', 'By offering free advertising', 'By verifying social accounts', 'By minting collectibles', 'A', 'billions'),
('Which cryptographic element ensures attestation validity?', 'Public-Private Key Signature', 'Encrypted Message Hash', 'Merkle Proof', 'Zero-Balance Check', 'A', 'billions'),
('Which company backs Billions'' stablecoin identity integrations?', 'idOS', 'PayPal', 'Circle', 'Binance', 'C', 'billions'),
('What makes Billions ideal for AI-human collaboration?', 'It creates a common layer of verifiable trust', 'It replaces humans in verification', 'It uses centralized dashboards', 'It removes data privacy', 'A', 'billions'),
('How does Billions fight deepfake-based impersonation?', 'By linking attestations to verified human proofs', 'By deleting fake media', 'By scanning all uploads', 'By banning new users', 'A', 'billions'),
('What''s a practical use case of Billions for governments or enterprises?', 'Digital identity and reputation infrastructure', 'Automated NFT generation', 'Blockchain gaming', 'Cloud hosting', 'A', 'billions'),
('What enables privacy-preserving KYC in Billions?', 'Zero-Knowledge KYC (ZK-KYC)', 'Social login', 'Fingerprint biometrics', 'Local verification', 'A', 'billions'),
('What does "Proof of Integrity" validate inside Billions'' system?', 'That an attested claim remains unmodified', 'That a transaction confirms instantly', 'That a node has uptime', 'That a wallet holds stake', 'A', 'billions');

-- Second set of 25 questions
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, category) VALUES
('What is the Billions Network''s method for verifying human identity without storing personal data?', 'Zero-Knowledge Proofs', 'Face Scanning', 'Manual KYC', 'Centralized Database', 'A', 'billions'),
('Which layer of Web3 infrastructure does Billions strengthen through attestations?', 'Consensus', 'Trust', 'Network', 'Identity', 'D', 'billions'),
('Billions uses decentralized identity to prevent which problem?', 'Sybil Attacks', 'Inflation', 'DDoS Attacks', 'Gas Spikes', 'A', 'billions'),
('What form of governance could allow token holders to propose upgrades in Billions?', 'DAO Governance', 'Central Council', 'Private Voting', 'Automated Scripts', 'A', 'billions'),
('The Billions Network integrates Sign Protocol to build what type of ecosystem?', 'Trust-based Reputation Network', 'Payment-only Gateway', 'NFT Marketplace', 'File Storage Network', 'A', 'billions'),
('Billions'' identity model supports which emerging concept in AI interaction?', 'Proof-of-Personhood', 'Facial Recognition', 'Password Hashing', 'Token Gating', 'A', 'billions'),
('How does Billions ensure each AI agent has verifiable activity?', 'Attestation Records', 'Smart Wallet Seeds', 'Cloud Logs', 'API Keys', 'A', 'billions'),
('Which metric defines a participant''s reliability within Billions?', 'Reputation Score', 'Gas Fee Ratio', 'Node Stake', 'Voting Frequency', 'A', 'billions'),
('Billions is helping build the foundation for what kind of economy?', 'Human-AI Economy', 'Gig Economy', 'Real Estate Market', 'Token Economy', 'A', 'billions'),
('What consensus ensures fairness in Billions'' ecosystem verification?', 'Proof-of-Honesty', 'Proof-of-Work', 'Proof-of-Stake', 'Proof-of-Participation', 'D', 'billions'),
('What is the key privacy advantage of using Sign Protocol with Billions?', 'Zero data leakage', 'Faster block time', 'Lower gas fees', 'Full identity disclosure', 'A', 'billions'),
('Which underlying principle ensures decentralization in Billions Network?', 'Distributed Attestation', 'Node Centralization', 'Consensus Reuse', 'API Mirroring', 'A', 'billions'),
('What role does Sentient play in Billions'' AI infrastructure?', 'AI Alignment Partner', 'Liquidity Provider', 'Cross-chain Bridge', 'Storage Manager', 'A', 'billions'),
('The "Playground" under Billions primarily serves what purpose?', 'User Experimentation and Interaction', 'Gaming Hub', 'Token Trading', 'Data Indexing', 'A', 'billions'),
('Billions is sometimes described as a "network of networks." What does this mean?', 'It integrates multiple trust layers and protocols', 'It runs on multiple CPUs', 'It has several game servers', 'It manages IoT devices', 'A', 'billions'),
('What type of wallet interaction does Billions recommend for attestations?', 'Signer Wallets', 'Hardware Wallets', 'Multisig Wallets', 'Paper Wallets', 'A', 'billions'),
('Billions'' reputation model enables users to do what across dApps?', 'Carry verified trust history', 'Swap tokens', 'Mine blocks', 'Rent data', 'A', 'billions'),
('The Billions Network promotes interoperability through what standard?', 'Attestation Registry Standard (ARS)', 'ERC-4337', 'ERC-20', 'ERC-1155', 'A', 'billions'),
('Which of the following is a long-term vision of Billions?', 'To unify human and AI identity under one verifiable system', 'To replace traditional currencies', 'To launch a social media app', 'To mine Bitcoin', 'A', 'billions'),
('What''s the unique benefit of Billions in governance ecosystems?', 'Verified voter participation', 'Gasless voting', 'Anonymous admins', 'Centralized control', 'A', 'billions'),
('How does Billions prevent duplicate or fake accounts?', 'Attestation uniqueness', 'Multi-device login', 'Password reset limits', 'IP matching', 'A', 'billions'),
('What drives the Proof-of-Humanity within Billions?', 'Identity attestations', 'Age verification', 'Fingerprint matching', 'Cloud syncing', 'A', 'billions'),
('Billions is expected to evolve into a core component of what future Web3 model?', 'Reputation-based Internet', 'Energy-efficient Blockchain', 'NFT Gaming World', 'DeFi Layer', 'A', 'billions'),
('Which data principle governs how Billions handles personal information?', 'Self-sovereign data', 'Custodial management', 'Encrypted cloud storage', 'Public data sharing', 'A', 'billions'),
('Billions integrates with AI systems primarily to:', 'Enable verified AI identities', 'Speed up mining', 'Replace blockchain nodes', 'Collect analytics', 'A', 'billions');

-- ============================================================================
-- 5. CREATE FUNCTIONS
-- ============================================================================

-- Function to update user points and level
CREATE OR REPLACE FUNCTION update_user_points(
  p_user_id UUID,
  p_points INTEGER,
  p_experience INTEGER
) RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    points = points + p_points,
    experience = experience + p_experience,
    level = CASE 
      WHEN experience + p_experience >= (1000 * POWER(1.1, level - 1)) THEN level + 1
      ELSE level
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process referral bonus
CREATE OR REPLACE FUNCTION process_referral_bonus(
  p_new_user_id UUID,
  p_referral_code TEXT
) RETURNS void AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  -- Find the referrer
  SELECT id INTO v_referrer_id FROM users WHERE referral_code = p_referral_code LIMIT 1;
  
  IF v_referrer_id IS NOT NULL THEN
    -- Award 200 points to referrer
    UPDATE users SET points = points + 200, updated_at = NOW() WHERE id = v_referrer_id;
    
    -- Update referred_by for new user
    UPDATE users SET referred_by = v_referrer_id, updated_at = NOW() WHERE id = p_new_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. CREATE VIEWS FOR LEADERBOARD
-- ============================================================================

-- Top players by points
CREATE OR REPLACE VIEW leaderboard_top_players AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY points DESC) as rank,
  id,
  username,
  points,
  level,
  is_verified,
  profile_picture_url,
  created_at
FROM users
ORDER BY points DESC
LIMIT 100;

-- Top players by referrals
CREATE OR REPLACE VIEW leaderboard_top_referrers AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY referral_count DESC) as rank,
  id,
  username,
  referral_count,
  points,
  profile_picture_url
FROM (
  SELECT 
    u.id,
    u.username,
    COUNT(ur.id) as referral_count,
    u.points,
    u.profile_picture_url
  FROM users u
  LEFT JOIN users ur ON ur.referred_by = u.id
  GROUP BY u.id, u.username, u.points, u.profile_picture_url
) subquery
ORDER BY referral_count DESC
LIMIT 100;

-- ============================================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for game_results table
CREATE POLICY "Users can read their own game results" ON game_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own game results" ON game_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for verification_attempts table
CREATE POLICY "Users can read their own verification attempts" ON verification_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own verification attempts" ON verification_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 8. DONE - Database is ready!
-- ============================================================================
