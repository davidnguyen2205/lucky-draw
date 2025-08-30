-- Lucky Draw Database Schema
-- PostgreSQL version

-- Create database (run separately)
-- CREATE DATABASE lucky_draw;

-- Connect to lucky_draw database and run the following:

-- Table: users (for session management)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: persons (participants in the lottery)
CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    identity VARCHAR(255),
    avatar TEXT,
    x INTEGER,
    y INTEGER,
    is_win BOOLEAN DEFAULT FALSE,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_session_id VARCHAR(255) REFERENCES users(session_id)
);

-- Table: prizes (prize configurations)
CREATE TABLE IF NOT EXISTS prizes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sort_order INTEGER,
    is_all BOOLEAN DEFAULT FALSE,
    count INTEGER DEFAULT 1,
    is_used_count INTEGER DEFAULT 0,
    picture_id VARCHAR(50),
    picture_name VARCHAR(255),
    picture_url TEXT,
    separate_count_enable BOOLEAN DEFAULT FALSE,
    separate_count_list JSONB DEFAULT '[]',
    description TEXT,
    is_show BOOLEAN DEFAULT TRUE,
    is_used BOOLEAN DEFAULT FALSE,
    frequency INTEGER DEFAULT 1,
    user_session_id VARCHAR(255) REFERENCES users(session_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: lottery_results (who won what)
CREATE TABLE IF NOT EXISTS lottery_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id INTEGER REFERENCES persons(id),
    prize_id VARCHAR(50) REFERENCES prizes(id),
    prize_name VARCHAR(255),
    prize_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_session_id VARCHAR(255) REFERENCES users(session_id)
);

-- Table: global_configs (UI and application settings)
CREATE TABLE IF NOT EXISTS global_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(255) NOT NULL,
    config_value JSONB,
    user_session_id VARCHAR(255) REFERENCES users(session_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(config_key, user_session_id)
);

-- Table: uploaded_files (images and music)
CREATE TABLE IF NOT EXISTS uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size BIGINT,
    file_path TEXT,
    mime_type VARCHAR(255),
    user_session_id VARCHAR(255) REFERENCES users(session_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_persons_user_session ON persons(user_session_id);
CREATE INDEX IF NOT EXISTS idx_prizes_user_session ON prizes(user_session_id);
CREATE INDEX IF NOT EXISTS idx_lottery_results_user_session ON lottery_results(user_session_id);
CREATE INDEX IF NOT EXISTS idx_lottery_results_person ON lottery_results(person_id);
CREATE INDEX IF NOT EXISTS idx_lottery_results_prize ON lottery_results(prize_id);
CREATE INDEX IF NOT EXISTS idx_global_configs_user_session ON global_configs(user_session_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_session ON uploaded_files(user_session_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON persons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prizes_updated_at BEFORE UPDATE ON prizes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_configs_updated_at BEFORE UPDATE ON global_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
