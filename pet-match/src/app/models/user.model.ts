export type UserRole = 'User' | 'Shelter';

export interface User {
  _id: string;
  email: string;
  username?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  likedAnimals?: string[];
}
