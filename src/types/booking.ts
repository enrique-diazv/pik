export interface MockAppointment {
  id: string;
  staffId: string;
  date: string;
  startsAt: string;
  endsAt: string;
}

export interface BookingSlot {
  startsAt: string;
  endsAt: string;
  availableStaffIds: string[];
}

export interface BookingReservation extends MockAppointment {
  serviceId: string;
  priceMxn: number;
}