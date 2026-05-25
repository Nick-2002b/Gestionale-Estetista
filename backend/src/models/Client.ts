export interface Client {
  id?: number;
  name: string;
  surname: string;
  sex?: "M" | "F" | "Altro";
  phone?: string;
  email?: string;
  notes?: string;
  created_at?: string;
}
