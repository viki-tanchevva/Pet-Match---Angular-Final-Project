export interface User {
    _id: string,
    username: string,
    email: string,
    role: 'User' | 'Shelter',
    likedAnimals?: string[]
}