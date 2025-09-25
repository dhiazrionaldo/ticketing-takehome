import { createClient, SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepo {
    //TODO: Initiate Supabase client here and use it in derived classes
    protected client: SupabaseClient;

    constructor() {
        //TODO: Initialize Supabase client here using environment variables
        if (!process.env.NODE_SUPABASE_URL || !process.env.NODE_SUPABASE_PRIVATE_KEY) {
        throw new Error('Supabase env variables missing!');
        }
        this.client = createClient(
        process.env.NODE_SUPABASE_URL,
        process.env.NODE_SUPABASE_PRIVATE_KEY
        );
    }
}
