import { Request, Response, NextFunction } from 'express';
import { ProfileRepo } from '../repos/ProfileRepo';

//TODO: Middleware to require admin role
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user; //get authenticated user from request
    if (!user) return res.status(401).json({ message: 'Not authenticated' }); //if no user, return 401

    //check if user has admin role
    //Note: we are using ProfileRepo directly here for simplicity
    //In a real app, consider using a service layer

    const repo = new ProfileRepo(); //get profile repo
    const profile = await repo.findById(user.id);//get profile by user ID
    if (!profile || profile.role !== 'admin') return res.status(403).json({ message: 'Admin only' });//if no profile or not admin, return 403

    //user is admin, proceed to next middleware or route handler
    next();
  } catch (err: any) {
    //if error, return 500 status with error message
    return res.status(500).json({ message: err.message });
  }
}
