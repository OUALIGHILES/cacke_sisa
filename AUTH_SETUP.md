# SISA_Cake Authentication Setup Guide

This guide will help you set up the authentication system for the SISA_Cake website.

## Overview

The authentication system uses:
- **Phone number** as the primary identifier
- **Password** for security
- **Custom database functions** for authentication
- **LocalStorage** for session management

## Database Setup

### Step 1: Run the Authentication SQL

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste the contents of `scripts/auth-functions.sql`
4. Click **Run** to execute all the SQL commands

Alternatively, you can run just these essential functions:

```sql
-- Authentication function for sign in
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

-- Create user function for sign up
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
    IF EXISTS (SELECT 1 FROM users WHERE phone = p_phone) THEN
        RAISE EXCEPTION 'Phone number already registered';
    END IF;

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
```

### Step 2: Configure Row Level Security (RLS)

Run these SQL commands to set up the RLS policies:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public to create users (sign up)
CREATE POLICY "Public can create users" ON users
    FOR INSERT WITH CHECK (true);

-- Allow public to read users (needed for auth check)
CREATE POLICY "Public can view users" ON users
    FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);
```

### Step 3: Create Admin User (Optional)

To create an admin user, run:

```sql
INSERT INTO users (phone, password, role, name, email)
VALUES (
    '213540000739',
    'admin123',
    'admin',
    'Admin User',
    'admin@sisacake.com'
);
```

**⚠️ IMPORTANT:** Change the default admin password in production!

## Features

### Sign In Page (`/signin`)
- Phone number and password authentication
- Password visibility toggle
- Form validation
- Error handling
- Demo credentials displayed for testing

### Sign Up Page (`/signup`)
- Full name, phone, email (optional), password
- Password strength indicator
- Password confirmation
- Form validation
- Duplicate phone number check

### Navbar Updates
- **Sign In** and **Sign Up** buttons for non-authenticated users
- User profile dropdown for authenticated users
- Admin badge for admin users
- Sign out functionality

## Usage

### For Customers:
1. Click **Sign Up** in the navbar
2. Enter your details (name, phone, optional email, password)
3. Click **Create Account**
4. You'll be automatically signed in

### For Admin:
1. Use the demo credentials:
   - Phone: `213540000739`
   - Password: `admin123`
2. After signing in, the admin button will appear in the user dropdown
3. Access the admin dashboard at `/admin`

## Security Notes

### ⚠️ Production Recommendations:

1. **Password Hashing**: 
   - Currently, passwords are stored in plain text
   - In production, use bcrypt or argon2 for password hashing
   - Example: `password_hash := crypt(p_password, gen_salt('bf'));`

2. **Row Level Security**:
   - Implement proper RLS policies
   - Use Supabase Auth for better security

3. **Rate Limiting**:
   - Add rate limiting to prevent brute force attacks
   - Use Supabase Edge Functions for rate limiting

4. **HTTPS**:
   - Always use HTTPS in production

5. **Environment Variables**:
   - Never commit `.env` files to version control
   - Use environment variables for sensitive data

## File Structure

```
sisa_cake/
├── app/
│   ├── signin/          # Sign in page
│   ├── signup/          # Sign up page
│   └── layout.tsx       # Updated with AuthProvider
├── components/
│   └── navbar.tsx       # Updated with auth buttons
├── contexts/
│   ├── auth-context.tsx # Authentication context
│   └── language-context.tsx # Updated with auth translations
├── lib/
│   └── supabase.ts      # Supabase client
└── scripts/
    ├── auth-functions.sql    # Complete auth SQL functions
    └── completquery.sql      # Updated with auth functions
```

## Troubleshooting

### Error: "Phone number already registered"
- A user with this phone number already exists
- Try signing in instead of signing up

### Error: "Invalid phone number or password"
- Check that you're using the correct credentials
- Ensure the phone number format is correct (10 digits)

### Error: "Failed to create account"
- Check that the SQL functions are created in Supabase
- Verify RLS policies are set up correctly
- Check the browser console for detailed error messages

### Admin button not showing
- Ensure the user has `role: 'admin'` in the database
- Try signing out and signing back in

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify the database setup in Supabase SQL Editor
3. Ensure all SQL functions are created successfully
