-- Fix role conflict: admin account should ONLY have admin role, not both admin + user.
-- Reset the dedicated admin credentials and ensure clean role separation.

-- 1. Replace signup trigger so the dedicated admin email gets ONLY 'admin',
--    and every other new signup gets ONLY 'user'. No more dual-role conflict.
CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'dowellobilor5@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Ensure the trigger is actually attached to auth.users (it may be missing).
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_admin_on_signup();

-- Ensure profile trigger exists too (handle_new_user)
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Clean up role conflict for the dedicated admin: remove any 'user' role
--    assigned to that account, and guarantee the 'admin' role exists.
DO $$
DECLARE
  admin_uid uuid;
BEGIN
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'dowellobilor5@gmail.com' LIMIT 1;

  IF admin_uid IS NOT NULL THEN
    -- Remove any non-admin role rows for the admin account
    DELETE FROM public.user_roles
    WHERE user_id = admin_uid AND role <> 'admin';

    -- Ensure admin role is present
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_uid, 'admin')
    ON CONFLICT DO NOTHING;

    -- 3. Reset password to the requested value using pgcrypto bcrypt.
    UPDATE auth.users
    SET encrypted_password = crypt('Dodexceo22#$@', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = admin_uid;
  END IF;
END $$;

-- 4. Strip 'admin' role from any other accounts (in case of stale grants).
DELETE FROM public.user_roles
WHERE role = 'admin'
  AND user_id NOT IN (SELECT id FROM auth.users WHERE email = 'dowellobilor5@gmail.com');
