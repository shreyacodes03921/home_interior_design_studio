import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel, IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, phone, preferences } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = UserModel.findOne(u => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      res.status(400).json({ success: false, error: 'An account with this email already exists.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = UserModel.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`,
      wishlist: [],
      phone: phone || '',
      preferences: preferences || {},
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const { passwordHash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Registration failed.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = UserModel.findOne(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    if (user.status === 'deactivated') {
      res.status(403).json({ success: false, error: 'This account has been deactivated. Please contact support.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Login failed.' });
  }
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Google email is required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = UserModel.findOne(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // Create new user via Google
      user = UserModel.insertOne({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        passwordHash: bcrypt.hashSync(Math.random().toString(36), 10),
        role: 'user',
        avatar: avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        wishlist: [],
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }

    if (user.status === 'deactivated') {
      res.status(403).json({ success: false, error: 'This account has been deactivated.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Google authentication failed.' });
  }
}

export async function resetPasswordRequest(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required.' });
      return;
    }

    const user = UserModel.findOne(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      // Return success anyway for security best practice
      res.json({ success: true, message: 'If an account exists, a reset link has been dispatched.' });
      return;
    }

    const resetToken = Math.random().toString(36).substring(2, 12);
    UserModel.findByIdAndUpdate(user.id, {
      resetToken,
      resetExpires: Date.now() + 3600000 // 1 hour
    });

    console.log(`[Password Reset] Generated reset token for ${user.email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset link sent to your email.',
      debugToken: resetToken // Provided so testers can reset in preview easily
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Reset failed.' });
  }
}

export async function completeResetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'Valid token and minimum 6-character password required.' });
      return;
    }

    const user = UserModel.findOne(u => u.resetToken === token && (u.resetExpires || 0) > Date.now());
    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid or expired password reset token.' });
      return;
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    UserModel.findByIdAndUpdate(user.id, {
      passwordHash,
      resetToken: undefined,
      resetExpires: undefined
    });

    res.json({ success: true, message: 'Password has been successfully updated. You can now log in.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Password update failed.' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated.' });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ success: true, user: safeUser });
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated.' });
      return;
    }

    const { name, phone, avatar, preferences } = req.body;
    const updated = UserModel.findByIdAndUpdate(req.user.id, {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(avatar ? { avatar } : {}),
      ...(preferences ? { preferences } : {}),
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ success: true, user: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Profile update failed.' });
  }
}

export async function toggleWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Please log in to save designs to your wishlist.' });
      return;
    }

    const { designId } = req.body;
    if (!designId) {
      res.status(400).json({ success: false, error: 'designId is required.' });
      return;
    }

    const currentWishlist = req.user.wishlist || [];
    let updatedWishlist: string[];
    let added = false;

    if (currentWishlist.includes(designId)) {
      updatedWishlist = currentWishlist.filter(id => id !== designId);
    } else {
      updatedWishlist = [...currentWishlist, designId];
      added = true;
    }

    const updated = UserModel.findByIdAndUpdate(req.user.id, {
      wishlist: updatedWishlist
    });

    res.json({
      success: true,
      wishlist: updatedWishlist,
      added,
      message: added ? 'Design added to your wishlist.' : 'Design removed from your wishlist.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Wishlist update failed.' });
  }
}
