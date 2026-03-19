import { Pool } from 'pg';
import { config } from './index';

export const pool = new Pool(
  config.database.url 
    ? { 
        connectionString: config.database.url,
        ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
      }
    : {
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        user: config.database.user,
        password: config.database.password,
      }
);

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Enable TimescaleDB extension
    await client.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');
    
    client.release();
    
    await createTables();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        matric_number VARCHAR(255) UNIQUE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'power_admin', 'super_admin')),
        campus_zone_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Campus zones table
    await client.query(`
      CREATE TABLE IF NOT EXISTS campus_zones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        fuel_level INTEGER DEFAULT 100,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Power status history table (TimescaleDB hypertable)
    await client.query(`
      CREATE TABLE IF NOT EXISTS power_status_history (
        id SERIAL,
        campus_zone_id INTEGER NOT NULL,
        power_source VARCHAR(20) NOT NULL CHECK (power_source IN ('grid', 'generator', 'off')),
        status VARCHAR(20) NOT NULL,
        changed_by INTEGER NOT NULL,
        notes TEXT,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Convert to hypertable if TimescaleDB is available
    try {
      await client.query(`
        SELECT create_hypertable('power_status_history', 'timestamp', if_not_exists => TRUE);
      `);
    } catch (err) {
      console.log('TimescaleDB hypertable creation skipped or already exists');
    }
    
    // Generator schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS generator_schedules (
        id SERIAL PRIMARY KEY,
        campus_zone_id INTEGER NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        days_of_week INTEGER[] NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        old_value JSONB,
        new_value JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Push notification tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS push_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token VARCHAR(255) NOT NULL,
        platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Prediction results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prediction_results (
        id SERIAL PRIMARY KEY,
        campus_zone_id INTEGER NOT NULL,
        predicted_source VARCHAR(20) NOT NULL,
        confidence_score DECIMAL(5,2),
        prediction_for TIMESTAMP NOT NULL,
        model_version VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crowdsourced reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS crowdsourced_reports (
        id SERIAL PRIMARY KEY,
        campus_zone_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        reported_source VARCHAR(20) NOT NULL CHECK (reported_source IN ('grid', 'generator', 'off')),
        verification_count INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default campus zones
    await client.query(`
      INSERT INTO campus_zones (name, description)
      SELECT * FROM (VALUES 
        ('Main Campus', 'Primary university campus area'),
        ('Science Block', 'Science and engineering buildings'),
        ('Library Complex', 'Library and study areas'),
        ('Hostel Zone', 'Student accommodation area'),
        ('Sports Complex', 'Sports facilities and grounds')
      ) AS v(name, description)
      WHERE NOT EXISTS (SELECT 1 FROM campus_zones LIMIT 1);

      -- Seed initial power status for zones (Set some to 'grid' by default)
      INSERT INTO power_status_history (campus_zone_id, power_source, status, changed_by, notes)
      SELECT cz.id, 'grid', 'Stable Supply', 1, 'Initial system startup'
      FROM campus_zones cz
      WHERE NOT EXISTS (SELECT 1 FROM power_status_history WHERE campus_zone_id = cz.id)
      LIMIT 3;
    `);
    
    // Create Indexes for Performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_power_status_zone_timestamp ON power_status_history (campus_zone_id, timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_prediction_zone_time ON prediction_results (campus_zone_id, prediction_for DESC);
      CREATE INDEX IF NOT EXISTS idx_crowdsource_zone_verified ON crowdsourced_reports (campus_zone_id, is_verified);
    `);
    
    console.log('Database tables and indexes initialized successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};
