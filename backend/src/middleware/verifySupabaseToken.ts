import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const admin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, detectSessionInUrl: false } }
);

//TODO: Middleware to verify Supabase JWT token from Authorization header
export async function verifySupabaseToken(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization; //get Authorization header

    // Check if the Authorization header is present and properly formatted
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    // Extract the token from the header
    const token = auth.split(' ')[1];

    // Verify the token using Supabase admin client
    const { data, error } = await admin.auth.getUser(token);
    // If there's an error or no user, return 401
    if (error || !data.user) return res.status(401).json({ message: 'Invalid or expired token' });

    (req as any).user = {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata
    };

    // Token is valid, proceed to the next middleware or route handler
    return next();
  } catch (err: any) {
    // Log the error for debugging purposes
    console.error('verifySupabaseToken error', err);

    // If there's an unexpected error, return 500
    return res.status(500).json({ message: 'Internal auth error' });
  }
}
