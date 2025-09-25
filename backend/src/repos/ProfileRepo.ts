import { BaseRepo } from './BaseRepo';
import { Profile } from '../models/Profile';

export class ProfileRepo extends BaseRepo {
  async findById(id: string): Promise<Profile | null> {
    //TODO: Get profile data based on ID from Supabase
    const { data, error } = await this.client.from('profiles').select('*').eq('id', id).single();
    
    //Throw error if any issues
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    
    //Return null if no data found
    if (!data) return null;

    //Map data to Profile model and return
    return new Profile(data.id, data.full_name, data.role, data.created_at);
  }

  async upsert(id: string, payload: Partial<Profile>): Promise<Profile> {
    //TODO: Upsert profile data on Supabase
    const row = { id, full_name: payload.full_name ?? null, role: payload.role ?? 'user' };
    const { data, error } = await this.client.from('profiles').upsert(row, { onConflict: 'id', returning: 'representation' }).select().single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);
    
    //Map data to Profile model and return
    return new Profile(data.id, data.full_name, data.role, data.created_at);
  }

  async setRole(id: string, role: string): Promise<Profile> {
    //TODO: Update role for profile on Supabase based on ID
    const { data, error } = await this.client.from('profiles').update({ role }).eq('id', id).select().single();
    
    //Throw error if any issues
    if (error) throw new Error(error.message);

    //Map data to Profile model and return
    return new Profile(data.id, data.full_name, data.role, data.created_at);
  }
}
