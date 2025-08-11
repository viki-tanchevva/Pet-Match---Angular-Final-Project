export type AnimalType = 'dog' | 'cat' | 'rabbit' | 'guinea pig' | 'hamster' | 'bird' | 'turtle' | 'other'
                | 'Dog' | 'Cat' | 'Rabbit' | 'Guinea pig' | 'Hamster' | 'Bird' | 'Turtle' | 'Other';

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  age: number;
  location: string;
  imageUrl: string;
  description: string;
  addedByUserId?: string | null;
  likes?: number;
  adopted?: boolean;
}
