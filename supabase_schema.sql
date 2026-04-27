-- ============================================
-- SANTUARIO ELITE — SUPABASE SCHEMA (SAFE)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Compatible con tablas que ya existen
-- ============================================

-- =====================
-- 1. TABLA: users (agregar columnas faltantes si ya existe)
-- =====================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'CLIENT',
  membership_plan TEXT,
  membership_status TEXT DEFAULT 'INACTIVE',
  membership_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar columnas nuevas si no existen (safe para tablas existentes)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'CLIENT';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS membership_plan TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'INACTIVE';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS membership_expiry DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS assigned_coach UUID REFERENCES public.users(id);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- =====================
-- 2. TABLA: attendance
-- =====================
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ,
  method TEXT DEFAULT 'QR'
);

-- =====================
-- 3. TABLA: workouts (NUEVA)
-- =====================
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.users(id),
  athlete_id UUID NOT NULL REFERENCES public.users(id),
  workout_date DATE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. TABLA: messages (NUEVA)
-- =====================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id),
  receiver_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. TRIGGER: Auto-crear perfil en public.users al registrarse
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Limpiar policies anteriores
DROP POLICY IF EXISTS "Users read own profile" ON public.users;
DROP POLICY IF EXISTS "Admin updates users" ON public.users;
DROP POLICY IF EXISTS "Admin manages attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users read own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Coach manages workouts" ON public.workouts;
DROP POLICY IF EXISTS "Athlete reads own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Athlete updates own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users read own messages" ON public.messages;
DROP POLICY IF EXISTS "Users send messages" ON public.messages;

-- USERS
CREATE POLICY "Users read own profile" ON public.users FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH'))
);

CREATE POLICY "Admin updates users" ON public.users FOR UPDATE USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ATTENDANCE
CREATE POLICY "Admin manages attendance" ON public.attendance FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Users read own attendance" ON public.attendance FOR SELECT USING (
  user_id = auth.uid()
);

-- WORKOUTS
CREATE POLICY "Coach manages workouts" ON public.workouts FOR ALL USING (
  coach_id = auth.uid()
);

CREATE POLICY "Athlete reads own workouts" ON public.workouts FOR SELECT USING (
  athlete_id = auth.uid()
);

CREATE POLICY "Athlete updates own workouts" ON public.workouts FOR UPDATE USING (
  athlete_id = auth.uid()
);

-- MESSAGES
CREATE POLICY "Users read own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);

CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
);

-- =====================
-- 7. ÍNDICES
-- =====================
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_checked_in ON public.attendance(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_workouts_athlete_date ON public.workouts(athlete_id, workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_coach ON public.workouts(coach_id);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_assigned_coach ON public.users(assigned_coach);
