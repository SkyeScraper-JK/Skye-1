-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('AGENT', 'DEVELOPER', 'ADMIN', 'BUYER')) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    developer_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    property_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    handover_date DATE,
    description TEXT,
    amenities JSONB,
    brochure_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Units table
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    unit_number VARCHAR(50) NOT NULL,
    unit_code VARCHAR(100) UNIQUE,
    floor INTEGER,
    category VARCHAR(50),
    sub_type VARCHAR(50),
    area DECIMAL(10,2),
    balcony_area DECIMAL(10,2),
    view_description TEXT,
    base_price DECIMAL(15,2),
    current_price DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing options for promotional campaigns
CREATE TABLE IF NOT EXISTS unit_pricing_options (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id),
    option_type VARCHAR(50),
    description TEXT,
    discount_percentage DECIMAL(5,2),
    condition_text TEXT,
    final_price DECIMAL(15,2),
    fees JSONB,
    is_active BOOLEAN DEFAULT true,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Upload tracking for audit
CREATE TABLE IF NOT EXISTS upload_logs (
    id SERIAL PRIMARY KEY,
    developer_id INTEGER REFERENCES users(id),
    filename VARCHAR(255),
    file_size BIGINT,
    projects_processed INTEGER,
    units_processed INTEGER,
    errors_count INTEGER,
    status VARCHAR(50),
    processing_time INTERVAL,
    error_details JSONB,
    summary JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads management
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES users(id),
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20),
    buyer_email VARCHAR(255),
    project_id INTEGER REFERENCES projects(id),
    status VARCHAR(50) DEFAULT 'NEW',
    notes TEXT,
    lead_score INTEGER DEFAULT 0,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id),
    agent_id INTEGER REFERENCES users(id),
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20),
    buyer_email VARCHAR(255),
    booking_status VARCHAR(50) DEFAULT 'INITIATED',
    token_amount DECIMAL(15,2),
    final_price DECIMAL(15,2),
    payment_plan JSONB,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent project subscriptions
CREATE TABLE IF NOT EXISTS agent_project_subscriptions (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    developer_id INTEGER REFERENCES users(id),
    notification_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_id, project_id)
);