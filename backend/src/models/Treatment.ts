export interface Treatment {
  id?: number;
  name: string;
  category: string;
  description?: string;
  duration: number;
  price?: number;
  is_active?: number;
}
