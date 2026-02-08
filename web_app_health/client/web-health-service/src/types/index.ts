// src/types/index.ts
export interface Client {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  midName: string;
  birthDate: string; // или Date
  phoneNumber: string;
  healthIssues: string;
  height: string;
  weight: string;
  profilePhotoUrl: string | null;
  role: string;
}