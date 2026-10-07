import type {
  OpeningHours,
  Service,
  StaffMember,
} from "@/types/business";
import type {
  BookingReservation,
  MockAppointment,
} from "@/types/booking";
import { getBookingSlots } from "@/lib/booking-availability";
import { getMockAppointments } from "./bookings";

interface ConfirmBookingInput {
  date: string;
  startsAt: string;
  service: Service;
  staff: StaffMember[];
  staffId: string;
  openingHours: OpeningHours[];
}

const reservations: BookingReservation[] = [];
let nextReservationId = 0;

export function getBookingAppointments(
  date: string,
  staff: StaffMember[]
): MockAppointment[] {
  return [
    ...getMockAppointments(date, staff),
    ...reservations.filter((reservation) => reservation.date === date),
  ];
}

export async function confirmBookingMock({
  date,
  startsAt,
  service,
  staff,
  staffId,
  openingHours,
}: ConfirmBookingInput): Promise<BookingReservation> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  const startsOn = new Date(`${date}T${startsAt}:00`);

  if (
    Number.isNaN(startsOn.getTime()) ||
    startsOn.getTime() <= Date.now()
  ) {
    throw new Error("Elige una fecha y hora futuras.");
  }

  const slots = getBookingSlots({
    date,
    service,
    staff,
    staffId,
    openingHours,
    appointments: getBookingAppointments(date, staff),
  });

  const slot = slots.find((item) => item.startsAt === startsAt);
  const assignedStaffId = slot?.availableStaffIds[0];

  if (!slot || !assignedStaffId) {
    throw new Error(
      "Este horario ya no está disponible. Elige otro horario."
    );
  }

  nextReservationId += 1;

  const reservation: BookingReservation = {
    id: `reservation-${nextReservationId}`,
    serviceId: service.id,
    staffId: assignedStaffId,
    date,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    priceMxn: service.priceMxn,
  };

  reservations.push(reservation);

  return { ...reservation };
}