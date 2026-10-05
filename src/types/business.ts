export type BusinessCategory = "salon" | "barbershop" | "spa" | "nails";

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  priceMxn: number;
}

export interface StaffMember {
  id: string;
  name: string;
  serviceIds: string[];
}

export interface OpeningHours {
  /** ISO weekday: Monday = 1, Sunday = 7. */
  weekday: number;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  phone: string;
  address: string;
  description: string;
  openingHours: OpeningHours[];
  services: Service[];
  staff: StaffMember[];
}
