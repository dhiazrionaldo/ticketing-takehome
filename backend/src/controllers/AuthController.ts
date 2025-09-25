import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileServices';
import { CreateProfileDto } from '../dto/CreateProfileDto';

export class AuthController {
    //Initialize the ProfileService
    private profileService = new ProfileService();

    // TODO: Get authenticated user's profile
    getMe = async (req: Request, res: Response) => {
        try {
        const user = (req as any).user; //get authenticated user from request

        if (!user) return res.status(401).json({ message: 'Not authenticated' }); //if no user, return 401

        const profile = await this.profileService.getById(user.id);//get profile by user ID
        
        return res.json({ user, profile });//return user and profile as JSON response
        } catch (err: any) {
        //if error, return 500 status with error message
        res.status(500).json({ message: err.message });
        }
    };

    // TODO: Create or update authenticated user's profile
    upsertProfile = async (req: Request, res: Response) => {
        try {
        const dto: CreateProfileDto = req.body; //get data from request body
        const user = (req as any).user;//get authenticated user from request
        if (!user) return res.status(401).json({ message: 'Not authenticated' });//if no user, return 401

        //call service to create or update profile
        //Note: we are using 'user' to get the user ID for the profile
        const profile = await this.profileService.upsert(user.id, dto);
        //if successful, return 201 status with created/updated profile data
        res.status(201).json(profile);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };

    // Admin-only: set role for a profile
    setRole = async (req: Request, res: Response) => {
        try {
        const { userId, role } = req.body; //get userId and role from request body
        if (!userId || !role) return res.status(400).json({ message: 'userId and role required' }); //if no userId or role, return 400
        //call service to set role for the profile  
        const profile = await this.profileService.setRole(userId, role);
        //if successful, return profile as JSON response
        res.json(profile);
        } catch (err: any) {
        //if error, return 400 status with error message
        res.status(400).json({ message: err.message });
        }
    };
}
