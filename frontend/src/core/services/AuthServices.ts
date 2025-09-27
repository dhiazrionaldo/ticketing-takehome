import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { User } from "../models/User";

/**
 * AuthService
 *
 * Purpose:
 *  - Wrap Supabase Auth SDK into OOP-style class.
 *  - Provide methods for login, signup, logout, session management.
 */
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * signUp
   * Input: email, password
   * Output: User object (if session returned), else null
   * Notes:
   *  - If Supabase requires email confirmation, no session is returned.
   */
    async signUp(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);

        if (!data.user) return null;

        // also capture token if Supabase returned a session
        const token = data.session?.access_token ?? null;

        return new User(
            data.user.id,
            data.user.email ?? "",
            undefined,
            undefined,
            token??undefined
        );
    }

  /**
   * signIn
   * Input: email, password
   * Output: User object (if login success), else null
   */
    async signIn(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw new Error(error.message);

        if (!data.user) return null;

        const token = data.session?.access_token ?? null;
        
        return new User(
            data.user.id,
            data.user.email ?? "",
            undefined,
            undefined,
            token 
        );
    }

  /**
   * signOut
   * Output: void
   * Side effects: removes session from Supabase
   */
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  /**
   * getSession
   * Output: access token string or null
   */
  async getSession(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    console.log("Current session:", data);
    return data.session?.access_token ?? null;
  }

  /**
   * getCurrentUser
   * Output: User object if logged in, else null
   */
    async getCurrentUser(): Promise<User | null> {
        const { data: userData } = await this.supabase.auth.getUser();
        const { data: sessionData } = await this.supabase.auth.getSession();

        if (!userData.user) return null;

        const { data: profile, error } = await this.supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", userData.user.id)
            .single();

        return new User(
            userData.user.id,
            userData.user.email ?? "",
            profile?.role ?? undefined,
            profile?.full_name ?? undefined,
            sessionData.session?.access_token ?? undefined 
        );
        }


  /**
   * onAuthStateChange
   * Input: callback(event, user)
   * Output: subscription (unsubscribe function)
   */
  onAuthStateChange(cb: (event: string, user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user
        ? new User(session.user.id, session.user.email ?? "")
        : null;
      cb(event, user);
    });
  }
}

// Export singleton for global use
export const authService = new AuthService();
