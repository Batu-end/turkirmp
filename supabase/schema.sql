-- ============================================
-- HocamıDeğerlendir Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Universities Table
-- ============================================
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookups and city filtering
CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_city ON universities(city);

-- ============================================
-- 2. Professors Table
-- ============================================
CREATE TABLE professors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  title TEXT,  -- e.g. 'Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi'
  overall_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  would_take_again_pct NUMERIC(5,2) DEFAULT 0,
  average_difficulty NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for search and filtering
CREATE INDEX idx_professors_slug ON professors(slug);
CREATE INDEX idx_professors_university ON professors(university_id);
CREATE INDEX idx_professors_department ON professors(department);
-- Full-text search index for Turkish character support
CREATE INDEX idx_professors_name ON professors(first_name, last_name);

-- ============================================
-- 3. Reviews Table
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professor_id UUID NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  course_code TEXT,
  comment TEXT NOT NULL,
  would_take_again BOOLEAN,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for professor review lookups
CREATE INDEX idx_reviews_professor ON reviews(professor_id);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- ============================================
-- 4. Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Universities: anyone can read
CREATE POLICY "Universities are publicly readable"
  ON universities FOR SELECT
  USING (true);

-- Professors: anyone can read
CREATE POLICY "Professors are publicly readable"
  ON professors FOR SELECT
  USING (true);

-- Reviews: anyone can read
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (true);

-- Reviews: anyone can insert (anonymous reviews)
CREATE POLICY "Anyone can submit a review"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 5. Function: Recalculate professor stats
-- Called automatically after a new review
-- ============================================
CREATE OR REPLACE FUNCTION recalculate_professor_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE professors SET
    overall_rating = (
      SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE professor_id = NEW.professor_id
    ),
    total_reviews = (
      SELECT COUNT(*) FROM reviews WHERE professor_id = NEW.professor_id
    ),
    would_take_again_pct = (
      SELECT COALESCE(
        (COUNT(*) FILTER (WHERE would_take_again = true)::NUMERIC /
         NULLIF(COUNT(*) FILTER (WHERE would_take_again IS NOT NULL), 0)) * 100,
        0
      )
      FROM reviews WHERE professor_id = NEW.professor_id
    ),
    average_difficulty = (
      SELECT COALESCE(AVG(difficulty), 0) FROM reviews WHERE professor_id = NEW.professor_id
    )
  WHERE id = NEW.professor_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-recalculate after new review
CREATE TRIGGER trigger_recalculate_professor_stats
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_professor_stats();
