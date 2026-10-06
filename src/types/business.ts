export type BusinessCategory =
    |'salon'|'barbershop'|'spa'|'nails'|'massage'|'podiatry'|'physiotherapy';

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

export interface TimeRange {
  id?: string;
  opensAt: string;
  closesAt: string;
}

export interface OpeningHours {
  /** Lunes = 1, domingo = 7. */
  weekday: number;
  isOpen: boolean;
  ranges: TimeRange[];
}

export interface Business {
  id: string;
  name: string;
  categories: BusinessCategory[];
  phone: string;
  city: string;
  address: string;
  description: string;
  openingHours: OpeningHours[];
  services: Service[];
  staff: StaffMember[];
}

export type BusinessDetails = Pick<Business, 'name'|'phone'|'description'>;

export type BusinessLocation = Pick<
    Business,
    "city" | "address" | "openingHours"
>;