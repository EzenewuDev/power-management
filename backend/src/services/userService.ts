import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { config } from '../config';
import { User } from '../models';

export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0] || null;
  }

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    matricNumber?: string;
    role: string;
    campusZoneId?: number;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, matric_number, role, campus_zone_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.matricNumber,
        userData.role,
        userData.campusZoneId,
      ]
    );
    
    return result.rows[0];
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      campusZoneId: user.campus_zone_id,
    };
    
    return jwt.sign(payload, config.jwt.secret as jwt.Secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  async getAllUsers(): Promise<User[]> {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, campus_zone_id, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const allowedFields = ['first_name', 'last_name', 'role', 'campus_zone_id', 'is_active'];
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE users SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
}

export const userService = new UserService();
