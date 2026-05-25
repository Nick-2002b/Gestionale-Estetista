import { Treatment } from "./Treatment.js";

export interface Appointment {
  id?: number;
  client_id: number;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface AppointmentWithDetails extends Appointment {
  client_name: string;
  client_surname: string;
  client_phone?: string;
  treatments: Treatment[];
  total_duration: number;
  total_price: number;
}
