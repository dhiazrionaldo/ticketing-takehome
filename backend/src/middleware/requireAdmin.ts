import { Request, Response, NextFunction } from 'express';
import { ProfileRepo } from '../repos/ProfileRepo';

//TODO: Middleware to require admin role
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    //if user not found in request, return error
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const profileRepo = new ProfileRepo();
    const profile = await profileRepo.findById(user.id);

    //if no profile found, return error
    if (!profile) {
      return res.status(403).json({ message: 'Profile not found' });
    }

    //check if user has admin role
    if (profile.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    //user is admin, proceed to next middleware or route handler
    next();
  } catch (err: any) {
    //log the error for debugging purposes
    console.error('requireAdmin error:', err);
    //return 500 status with error message
    res.status(500).json({ message: 'Internal server error' });
  }
}
