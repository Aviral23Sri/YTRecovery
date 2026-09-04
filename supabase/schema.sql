-- ============================================================
-- YouTube Monetization Recovery Course — Supabase Schema
-- Run this in the Supabase SQL Editor (once, on a fresh project)
-- ============================================================

-- ── Tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  price         NUMERIC(10,2) NOT NULL DEFAULT 4999,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title     TEXT NOT NULL,
  position  INT  NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  youtube_video_id TEXT,
  position         INT  NOT NULL,
  duration_minutes NUMERIC(5,1)
);

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  course_id           UUID NOT NULL REFERENCES courses(id),
  razorpay_payment_id TEXT,
  amount_paid         NUMERIC(10,2),
  status              TEXT NOT NULL DEFAULT 'pending',
  purchased_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Consultations (1:1 call bookings — separate from course purchases) ──
-- Works for both authenticated and guest users.
-- user_id is nullable so guests don't need an account.
CREATE TABLE IF NOT EXISTS consultations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name          TEXT,
  guest_email         TEXT,
  guest_phone         TEXT,
  razorpay_order_id   TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  amount_paid         NUMERIC(10,2),
  status              TEXT NOT NULL DEFAULT 'pending', -- pending | success | failed
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────

ALTER TABLE courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases      ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations  ENABLE ROW LEVEL SECURITY;

-- consultations: logged-in users can view their own rows only
-- All inserts go through service_role (webhook / verify endpoint)
CREATE POLICY "consultations_own_read" ON consultations
  FOR SELECT USING (user_id = auth.uid());

-- courses: anyone can read published courses
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (is_published = true);

-- modules: anyone can read (curriculum is public / part of sales pitch)
CREATE POLICY "modules_public_read" ON modules
  FOR SELECT USING (true);

-- lessons: only readable by users who have a successful purchase for the parent course
CREATE POLICY "lessons_purchased_read" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM   purchases p
      JOIN   modules   m ON m.id = lessons.module_id
      WHERE  p.user_id   = auth.uid()
        AND  p.course_id = m.course_id
        AND  p.status    = 'success'
    )
  );

-- profiles: user can read & update only their own row
CREATE POLICY "profiles_own_select" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_own_insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- purchases: user can only read their own rows
-- INSERT/UPDATE is ONLY done via server-side webhook with service_role key
CREATE POLICY "purchases_own_read" ON purchases
  FOR SELECT USING (user_id = auth.uid());

-- ── Trigger: auto-create profile on signup ────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Seed: Course + Modules + Lessons ─────────────────────

DO $$
DECLARE
  v_course_id UUID;
  v_mod_id    UUID;
BEGIN

INSERT INTO courses (title, description, price, is_published)
VALUES (
  'YouTube Monetization Recovery Master Course 2026',
  'The definitive guide to recovering suspended or demonetized YouTube channels — and making sure it never happens again. Real strategies, real psychology, real results.',
  4999,
  true
)
RETURNING id INTO v_course_id;

-- Intro
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Introduction & Roadmap', 0) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'Welcome & What This Course Covers', 1, 5.0),
  (v_mod_id, 'How to Use This Course', 2, 3.5),
  (v_mod_id, 'Your Recovery Roadmap', 3, 8.0);

-- Module 01
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 01 — YouTube System Logic', 1) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'How YouTube''s Policy Engine Actually Works', 1, 12.0),
  (v_mod_id, 'The Flag → Review → Strike Pipeline', 2, 10.5),
  (v_mod_id, 'Why Automated Systems Get It Wrong', 3, 9.0),
  (v_mod_id, 'What "Trust Score" Really Means', 4, 11.0);

-- Module 02
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 02 — Inauthentic Content Deep Dive', 2) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'What YouTube Classifies as Inauthentic', 1, 13.0),
  (v_mod_id, 'Reused Content: The Grey Zone', 2, 11.0),
  (v_mod_id, 'Spam, Deceptive Practices & Manipulation', 3, 10.0),
  (v_mod_id, 'Case Studies: Channels That Got It Wrong', 4, 14.5);

-- Module 03
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 03 — Related Channel Suspension Deep Dive', 3) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'How YouTube Links Accounts', 1, 12.0),
  (v_mod_id, 'Device Fingerprinting & IP Signals', 2, 10.0),
  (v_mod_id, 'Breaking the Link: What Actually Works', 3, 15.0),
  (v_mod_id, 'Starting Fresh Without Getting Flagged Again', 4, 11.5);

-- Module 04
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 04 — Appeal Psychology', 4) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'Who Reads Your Appeal (and What They Look For)', 1, 9.0),
  (v_mod_id, 'The Anatomy of a Winning Appeal', 2, 16.0),
  (v_mod_id, 'Language, Tone & Framing Mistakes to Avoid', 3, 11.0),
  (v_mod_id, 'Writing Your Appeal: Live Walkthrough', 4, 20.0);

-- Module 05
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 05 — Reapply Strategy', 5) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'When to Reapply (Timing Is Everything)', 1, 8.0),
  (v_mod_id, 'Rebuilding Metrics Before Reapplying', 2, 12.0),
  (v_mod_id, 'The 30-Day Prep Checklist', 3, 10.0),
  (v_mod_id, 'What to Do If Rejected Again', 4, 9.5);

-- Module 06
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 06 — Future-Safe Strategy', 6) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'Building a Policy-Resilient Content Strategy', 1, 14.0),
  (v_mod_id, 'Metadata, Thumbnails & Title Hygiene', 2, 11.0),
  (v_mod_id, 'Diversifying Revenue So You''re Never Hostage to YPP', 3, 13.0),
  (v_mod_id, 'Community Guidelines: Staying Ahead of Changes', 4, 10.0);

-- Module 07
INSERT INTO modules (course_id, title, position) VALUES (v_course_id, 'Module 07 — Final Reality & Mindset', 7) RETURNING id INTO v_mod_id;
INSERT INTO lessons (module_id, title, position, duration_minutes) VALUES
  (v_mod_id, 'The Truth About Recovery Timelines', 1, 9.0),
  (v_mod_id, 'Managing the Emotional Toll', 2, 8.5),
  (v_mod_id, 'What Success Actually Looks Like', 3, 7.0),
  (v_mod_id, 'Final Message & Next Steps', 4, 6.0);

END $$;
