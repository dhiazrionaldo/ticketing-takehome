import { ProfileRepo } from '../repos/ProfileRepo';
import { CreateProfileDto } from '../dto/CreateProfileDto';
import { Profile } from '../models/Profile';

export class ProfileService {
    private repo = new ProfileRepo();

    //TODO: Implement getById method to get profile by ID
    async getById(id: string): Promise<Profile | null> {
        return this.repo.findById(id);
    }

    //TODO: Implement upsert method to create or update profile
    async upsert(id: string, dto: CreateProfileDto): Promise<Profile> {
        return this.repo.upsert(id, { full_name: dto.full_name ?? null, role: dto.role ?? 'user' });
    }

    //TODO: Implement setRole method to update profile role by ID
    async setRole(id: string, role: string): Promise<Profile> {
        return this.repo.setRole(id, role);
    }
}
