-- =====================================================
-- QUICK FIX - Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Create the authenticate_user function
CREATE OR REPLACE FUNCTION authenticate_user(p_phone VARCHAR, p_password VARCHAR)
RETURNS TABLE (
    id UUID,
    phone VARCHAR,
    name VARCHAR,
    email VARCHAR,
    role VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.phone,
        u.name,
        u.email,
        u.role
    FROM users u
    WHERE u.phone = p_phone 
    AND u.password = p_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can create users" ON users;
DROP POLICY IF EXISTS "Public can view users" ON users;
DROP POLICY IF EXISTS "Public can insert users" ON users;

-- Step 4: Create policies that allow insert and select
CREATE POLICY "Public can insert users" ON users
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public can view users" ON users
    FOR SELECT 
    USING (true);

-- Step 5: Create admin user if not exists
INSERT INTO users (phone, password, role, name, email)
VALUES (
    '0000000000',
    'admin123',
    'admin',
    'Admin User',
    'admin@sisacake.com'
)
ON CONFLICT (phone) DO NOTHING;

-- =====================================================
-- That's it! Run this entire script in Supabase SQL Editor
-- =====================================================
