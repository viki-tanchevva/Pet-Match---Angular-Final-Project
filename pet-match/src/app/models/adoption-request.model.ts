export type AdoptionStatus = 'Pending' | 'Approved' | 'Declined';

export interface AdoptionRequest {
  id: string;
  animalId: string;
  userId: string;
  shelterId: string | null;
  message: string;
  status: AdoptionStatus;
  createdAt: string;
  updatedAt: string;
  animal?: {
    id: string;
    name: string;
    imageUrl: string;
    type: string;
  } | null;
}
