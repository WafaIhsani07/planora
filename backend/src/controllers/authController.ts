import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface LoginPayload {
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'VENDOR';
  // Vendor specific fields
  businessName?: string;
  category?: string;
  city?: string;
  address?: string;
  phone?: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginPayload = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        vendorProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role = 'CUSTOMER',
      businessName,
      category,
      city,
      address,
      phone
    }: RegisterPayload = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'CUSTOMER'
      },
      include: {
        vendorProfile: true
      }
    });

    // If vendor, create vendor profile
    if (role === 'VENDOR' && businessName) {
      await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          businessName,
          description: '',
          location: address || city || ''
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
