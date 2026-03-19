import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, campusZoneId, matricNumber } = req.body;
    
    // LCU Matric Number Validation for Students
    if (role === 'student') {
      if (!matricNumber) {
        return res.status(400).json({ message: 'Matric number is required for students' });
      }
      
      const lcuMatricRegex = /^LCU\/UG\/(16|17|18|19|20|21|22|23|24|25|26|27)\/\d{5}$/i;
      if (!lcuMatricRegex.test(matricNumber)) {
        return res.status(400).json({ 
          message: 'Invalid LCU Matric Number. Format: LCU/UG/YY/XXXXX (YY between 16 and 27)' 
        });
      }
    }
    
    // Check if user already exists
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if matric number already exists for students
    if (role === 'student' && matricNumber) {
      const result = await pool.query('SELECT id FROM users WHERE matric_number = $1', [matricNumber]);
      if (result.rows.length > 0) {
        return res.status(400).json({ message: 'Matric number already registered' });
      }
    }
    
    const user = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      role,
      campusZoneId: campusZoneId ? parseInt(campusZoneId) : undefined,
      matricNumber,
    });
    
    const token = userService.generateToken(user);
    
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        campusZoneId: user.campus_zone_id,
      },
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    
    if (error && error.code === '23505') { // Unique violation in Postgres
      const field = error.detail?.includes('email') ? 'Email' : 'Matric number';
      return res.status(400).json({ message: `${field} is already registered` });
    }
    
    res.status(500).json({ message: 'An unexpected error occurred during registration. Please try again later.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await userService.findByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValid = await userService.validatePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = userService.generateToken(user);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await userService.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        campusZoneId: user.campus_zone_id,
      },
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Error getting profile' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
};
