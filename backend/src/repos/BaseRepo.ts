import { createClient, SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepo {
  //TODO: Initiate Supabase client here and use it in derived classes
  protected client: SupabaseClient;

  constructor() {
    //TODO: Initialize Supabase client here using environment variables
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, detectSessionInUrl: false } }
    );
  }
}
