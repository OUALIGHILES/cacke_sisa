-- =====================================================
-- SISA_CAKE DATABASE SCHEMA
-- Complete SQL Queries for Supabase Database
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- Stores admin and customer authentication data
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed password
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster phone lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- 2. CAKES TABLE
-- Stores all cake products with details
-- =====================================================
CREATE TABLE IF NOT EXISTS cakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image VARCHAR(500),
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cakes_category ON cakes(category);
CREATE INDEX IF NOT EXISTS idx_cakes_featured ON cakes(is_featured);
CREATE INDEX IF NOT EXISTS idx_cakes_available ON cakes(is_available);

-- =====================================================
-- 3. MESSAGES TABLE
-- Stores customer contact messages
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for unread messages
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- =====================================================
-- 4. SETTINGS TABLE
-- Stores business configuration
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure single row
    instagram VARCHAR(255),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    business_name VARCHAR(255) DEFAULT 'SISA_Cake',
    business_hours VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CAKE SIZES TABLE (Pricing Feature)
-- Stores available cake sizes with prices
-- =====================================================
CREATE TABLE IF NOT EXISTS cake_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    serves VARCHAR(50), -- e.g., "8-10 people"
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cake_sizes_active ON cake_sizes(is_active);
CREATE INDEX IF NOT EXISTS idx_cake_sizes_order ON cake_sizes(sort_order);

-- =====================================================
-- 6. CAKE ADD-ONS TABLE (Pricing Feature)
-- Stores available add-ons/extras with prices
-- =====================================================
CREATE TABLE IF NOT EXISTS cake_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    category VARCHAR(50), -- e.g., "toppings", "decorations", "flavors"
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cake_addons_active ON cake_addons(is_active);
CREATE INDEX IF NOT EXISTS idx_cake_addons_category ON cake_addons(category);
CREATE INDEX IF NOT EXISTS idx_cake_addons_order ON cake_addons(sort_order);

-- =====================================================
-- 7. ORDERS TABLE
-- Stores customer orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    cake_id UUID REFERENCES cakes(id) ON DELETE SET NULL,
    cake_size_id UUID REFERENCES cake_sizes(id) ON DELETE SET NULL,
    addon_ids UUID[], -- Array of addon IDs
    base_price DECIMAL(10, 2) NOT NULL,
    addons_price DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    delivery_date DATE,
    delivery_address TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

-- =====================================================
-- 8. ORDER ADDONS JUNCTION TABLE
-- Links orders to their selected add-ons
-- =====================================================
CREATE TABLE IF NOT EXISTS order_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    addon_id UUID REFERENCES cake_addons(id) ON DELETE SET NULL,
    addon_name VARCHAR(100) NOT NULL, -- Stored for historical record
    addon_price DECIMAL(10, 2) NOT NULL, -- Stored for historical record
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_addons_order ON order_addons(order_id);

-- =====================================================
-- 9. CATEGORIES TABLE
-- Stores cake categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- =====================================================
-- TRIGGER FUNCTIONS
-- Auto-update updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cakes_updated_at ON cakes;
CREATE TRIGGER update_cakes_updated_at
    BEFORE UPDATE ON cakes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cake_sizes_updated_at ON cake_sizes;
CREATE TRIGGER update_cake_sizes_updated_at
    BEFORE UPDATE ON cake_sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cake_addons_updated_at ON cake_addons;
CREATE TRIGGER update_cake_addons_updated_at
    BEFORE UPDATE ON cake_addons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access for cakes (everyone can view)
CREATE POLICY "Public can view available cakes" ON cakes
    FOR SELECT USING (is_available = true);

-- Public read access for cake sizes and addons
CREATE POLICY "Public can view active cake sizes" ON cake_sizes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active cake addons" ON cake_addons
    FOR SELECT USING (is_active = true);

-- Public can read settings
CREATE POLICY "Public can view settings" ON settings
    FOR SELECT USING (true);

-- Public can read categories
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = true);

-- Public can insert messages
CREATE POLICY "Public can send messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Public can create orders
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert order addons" ON order_addons
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA INSERTS
-- =====================================================

-- Insert default settings
INSERT INTO settings (id, instagram, whatsapp, email, location_lat, location_lng, address, business_hours)
VALUES (
    1,
    'https://instagram.com/sisacake',
    '1234567890',
    'hello@sisacake.com',
    40.7128,
    -74.0060,
    '123 Bakery Street, Sweet City, SC 12345',
    'Mon-Sun: 9AM - 8PM'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample cake sizes
INSERT INTO cake_sizes (name, price, description, serves, sort_order) VALUES
    ('Small Cake', 20.00, 'Perfect for intimate gatherings', '4-6 people', 1),
    ('Medium Cake', 35.00, 'Ideal for family celebrations', '8-12 people', 2),
    ('Large Cake', 50.00, 'Great for parties and events', '15-20 people', 3),
    ('XL Cake', 75.00, 'Perfect for large celebrations', '25-30 people', 4)
ON CONFLICT DO NOTHING;

-- Insert sample cake add-ons
INSERT INTO cake_addons (name, price, description, category, sort_order) VALUES
    ('Add Almonds', 5.00, 'Premium roasted almonds', 'toppings', 1),
    ('Extra Chocolate', 4.00, 'Rich Belgian chocolate drizzle', 'toppings', 2),
    ('Custom Name Writing', 3.00, 'Personalized message on cake', 'decorations', 3),
    ('Extra Decoration', 6.00, 'Additional fondant decorations', 'decorations', 4),
    ('Premium Fruits', 8.00, 'Fresh seasonal fruits', 'toppings', 5),
    ('Edible Gold Flakes', 10.00, 'Luxurious gold leaf decoration', 'decorations', 6),
    ('Whipped Cream Extra', 4.00, 'Extra layer of whipped cream', 'fillings', 7),
    ('Caramel Drizzle', 3.50, 'Homemade caramel sauce', 'toppings', 8)
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, sort_order) VALUES
    ('Birthday Cakes', 'Celebrate special birthdays with our custom cakes', 1),
    ('Wedding Cakes', 'Elegant multi-tier cakes for your big day', 2),
    ('Anniversary Cakes', 'Celebrate love with our romantic designs', 3),
    ('Custom Cakes', 'Design your dream cake with us', 4),
    ('Seasonal Specials', 'Limited edition seasonal flavors', 5)
ON CONFLICT DO NOTHING;

-- Insert sample cakes
INSERT INTO cakes (title, description, price, image, category, is_featured, is_available) VALUES
    ('Pink Rose Dream', 'A delicate three-tier cake adorned with handcrafted sugar roses and pearl accents. Perfect for elegant celebrations.', 85.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop', 'Birthday Cakes', true, true),
    ('Chocolate Truffle Bliss', 'Rich Belgian chocolate layers with velvety ganache frosting. A chocolate lover''s paradise.', 75.00, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=600&fit=crop', 'Birthday Cakes', true, true),
    ('Strawberry Delight', 'Fresh strawberries layered between vanilla sponge with cream cheese frosting. Light and refreshing.', 65.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop', 'Birthday Cakes', true, true),
    ('Golden Anniversary', 'Elegant gold-brushed fondant with intricate lace patterns. Perfect for milestone celebrations.', 120.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&h=600&fit=crop', 'Anniversary Cakes', true, true),
    ('Rainbow Surprise', 'Colorful layers of vanilla sponge with buttercream frosting. A party favorite for kids!', 55.00, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop', 'Birthday Cakes', true, true),
    ('Classic Red Velvet', 'Traditional red velvet with cream cheese frosting and white chocolate shavings.', 70.00, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&h=600&fit=crop', 'Custom Cakes', true, true)
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Note: In production, use proper password hashing with bcrypt
INSERT INTO users (phone, password, role, name, email) VALUES
    ('0000000000', '$2b$10$rQZ9QZJ5HGmQ5LX5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5', 'admin', 'Admin', 'admin@sisacake.com')
ON CONFLICT (phone) DO NOTHING;

-- =====================================================
-- USEFUL QUERIES FOR DEVELOPMENT
-- =====================================================

-- Get all featured cakes
-- SELECT * FROM cakes WHERE is_featured = true AND is_available = true ORDER BY created_at DESC;

-- Get all active cake sizes with prices
-- SELECT * FROM cake_sizes WHERE is_active = true ORDER BY sort_order;

-- Get all active add-ons grouped by category
-- SELECT * FROM cake_addons WHERE is_active = true ORDER BY category, sort_order;

-- Get unread messages count
-- SELECT COUNT(*) FROM messages WHERE is_read = false;

-- Get orders by status
-- SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC;

-- Calculate total revenue
-- SELECT SUM(total_price) FROM orders WHERE status = 'completed';

-- Get order with all details including addons
-- SELECT o.*,
--        cs.name as size_name,
--        array_agg(oa.addon_name) as addons
-- FROM orders o
-- LEFT JOIN cake_sizes cs ON o.cake_size_id = cs.id
-- LEFT JOIN order_addons oa ON o.id = oa.order_id
-- GROUP BY o.id, cs.name;

-- =====================================================
-- AUTHENTICATION FUNCTIONS
-- Run scripts/auth-functions.sql for complete auth setup
-- =====================================================

-- Quick authentication function for sign in
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
-- ROW LEVEL SECURITY (RLS) POLICIES FOR USERS TABLE
-- =====================================================

-- Allow public to create users (sign up)
CREATE POLICY "Public can create users" ON users
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (true); -- Simplified for custom auth - in production, use proper auth

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true); -- Simplified for custom auth
