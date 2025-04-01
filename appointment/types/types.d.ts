export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    experience: number;
    qualification: string;
    location: string;
    consultation_fee: number;
    gender: string;
    start_time: string;
    end_time: string;
    booked_slots: JSON;
    profile: string;
    rating: number;
  }

 export type DoctorCardProps = {
    id: number;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    profile: string;
  };