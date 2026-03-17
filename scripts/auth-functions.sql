-- =====================================================
-- AUTHENTICATION FUNCTIONS FOR SISA_CAKE
-- Add these functions to your Supabase database
-- =====================================================

-- =====================================================
-- 1. AUTHENTICATE USER FUNCTION
-- Validates phone and password for sign in
-- =====================================================
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
    AND u.password = p_password; -- In production, use proper password hashing verification
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. CREATE USER FUNCTION
-- Creates a new user account with validation
-- =====================================================
CREATE OR REPLACE FUNCTION create_user(
    p_phone VARCHAR,
    p_password VARCHAR,
    p_name VARCHAR,
    p_email VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    phone VARCHAR,
    name VARCHAR,
    email VARCHAR,
    role VARCHAR
) AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Check if phone already exists
    IF EXISTS (SELECT 1 FROM users WHERE phone = p_phone) THEN
        RAISE EXCEPTION 'Phone number already registered';
    END IF;

    -- Insert new user
    INSERT INTO users (phone, password, name, email, role)
    VALUES (p_phone, p_password, p_name, p_email, 'customer')
    RETURNING id INTO new_user_id;

    RETURN QUERY
    SELECT 
        u.id,
        u.phone,
        u.name,
        u.email,
        u.role
    FROM users u
    WHERE u.id = new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. UPDATE USER PROFILE FUNCTION
-- Updates user profile information
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_profile(
    p_user_id UUID,
    p_name VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users
    SET 
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. CHANGE PASSWORD FUNCTION
-- Updates user password with validation
-- =====================================================
CREATE OR REPLACE FUNCTION change_password(
    p_user_id UUID,
    p_old_password VARCHAR,
    p_new_password VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verify old password
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE id = p_user_id AND password = p_old_password
    ) THEN
        RAISE EXCEPTION 'Invalid current password';
    END IF;

    -- Update password
    UPDATE users
    SET 
        password = p_new_password,
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. GET USER BY ID FUNCTION
-- Retrieves user information by ID
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    phone VARCHAR,
    name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.phone,
        u.name,
        u.email,
        u.role,
        u.created_at
    FROM users u
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- IMPORTANT SECURITY NOTES:
-- =====================================================
-- 1. PASSWORD HASHING:
--    In production, NEVER store plain text passwords.
--    Use bcrypt or argon2 for password hashing.
--    Example: password_hash := crypt(p_password, gen_salt('bf'));
--
-- 2. ROW LEVEL SECURITY (RLS):
--    Add RLS policies to restrict access to user data:
--    
--    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
--    
--    -- Users can only view their own data
--    CREATE POLICY "Users can view own profile" ON users
--        FOR SELECT USING (auth.uid() = id);
--    
--    -- Only admins can view all users
--    CREATE POLICY "Admins can view all users" ON users
--        FOR SELECT USING (
--            EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
--        );
--
-- 3. RATE LIMITING:
--    Implement rate limiting for authentication attempts
--    to prevent brute force attacks.
--
-- 4. HTTPS:
--    Always use HTTPS in production to encrypt
--    credentials in transit.
-- =====================================================

-- =====================================================
-- USAGE EXAMPLES:
-- =====================================================

-- Authenticate user (sign in):
-- SELECT * FROM authenticate_user('0123456789', 'password123');

-- Create new user (sign up):
-- SELECT * FROM create_user('0123456789', 'password123', 'John Doe', 'john@example.com');

-- Update user profile:
-- SELECT update_user_profile('user-uuid-here', 'Jane Doe', 'jane@example.com');

-- Change password:
-- SELECT change_password('user-uuid-here', 'old_password', 'new_password');

-- Get user by ID:
-- SELECT * FROM get_user_by_id('user-uuid-here');
