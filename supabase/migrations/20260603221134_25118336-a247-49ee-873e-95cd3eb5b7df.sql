
-- Extend category enum
ALTER TYPE public.transaction_category ADD VALUE IF NOT EXISTS 'marketing';
ALTER TYPE public.transaction_category ADD VALUE IF NOT EXISTS 'software';
ALTER TYPE public.transaction_category ADD VALUE IF NOT EXISTS 'subscription';
ALTER TYPE public.transaction_category ADD VALUE IF NOT EXISTS 'operations';

-- Source + plan enums
DO $$ BEGIN
  CREATE TYPE public.transaction_source AS ENUM ('manual','email');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.user_plan AS ENUM ('free','pro','advanced');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.email_account_status AS ENUM ('connected','disconnected','error','reauth_required');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.email_sync_status AS ENUM ('queued','running','success','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS source public.transaction_source NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS email_account_id uuid,
  ADD COLUMN IF NOT EXISTS email_message_id text,
  ADD COLUMN IF NOT EXISTS confidence numeric(3,2),
  ADD COLUMN IF NOT EXISTS merchant text,
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_transactions_email_message ON public.transactions(email_message_id) WHERE email_message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);

-- email_accounts
CREATE TABLE IF NOT EXISTS public.email_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'gmail',
  email text NOT NULL,
  access_token_enc text,
  refresh_token_enc text,
  token_expires_at timestamptz,
  scopes text,
  status public.email_account_status NOT NULL DEFAULT 'connected',
  last_synced_at timestamptz,
  last_history_id text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider, email)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_accounts TO authenticated;
GRANT ALL ON public.email_accounts TO service_role;
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own email accounts" ON public.email_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own email accounts" ON public.email_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own email accounts" ON public.email_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own email accounts" ON public.email_accounts FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_email_accounts_updated BEFORE UPDATE ON public.email_accounts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- email_sync_jobs
CREATE TABLE IF NOT EXISTS public.email_sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.email_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.email_sync_status NOT NULL DEFAULT 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  processed_count integer NOT NULL DEFAULT 0,
  imported_count integer NOT NULL DEFAULT 0,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_sync_jobs TO authenticated;
GRANT ALL ON public.email_sync_jobs TO service_role;
ALTER TABLE public.email_sync_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own sync jobs" ON public.email_sync_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sync jobs" ON public.email_sync_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_email_sync_jobs_account ON public.email_sync_jobs(account_id, created_at DESC);

-- email_imported_messages (dedup)
CREATE TABLE IF NOT EXISTS public.email_imported_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.email_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_message_id text NOT NULL,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  parser_name text,
  parsed_status text NOT NULL DEFAULT 'imported',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (account_id, gmail_message_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_imported_messages TO authenticated;
GRANT ALL ON public.email_imported_messages TO service_role;
ALTER TABLE public.email_imported_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own imported messages" ON public.email_imported_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own imported messages" ON public.email_imported_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_plans
CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan public.user_plan NOT NULL DEFAULT 'free',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_plans TO authenticated;
GRANT ALL ON public.user_plans TO service_role;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own plan" ON public.user_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage plans" ON public.user_plans FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_user_plans_updated BEFORE UPDATE ON public.user_plans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed plans for existing users
INSERT INTO public.user_plans (user_id, plan)
SELECT id, 'free'::public.user_plan FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Auto-create plan row on signup (extend handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, business_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_plans (user_id, plan)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;
