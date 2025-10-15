import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (email) {
      const user = await PrismaDatabase.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);
    }

    if (id) {
      const user = await PrismaDatabase.getUserById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);
    }

    const users = await PrismaDatabase.getAllUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Check if user already exists
    const existingUser = await PrismaDatabase.getUserByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = await PrismaDatabase.createUser(userData);
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatedUser = await PrismaDatabase.updateUser(id, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const deleted = await PrismaDatabase.deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
