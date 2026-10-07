import type {
  OpeningHours,
  Service,
  StaffMember,
} from "@/types/business";
import type { BookingSlot, MockAppointment } from "@/types/booking";
import { minutesToTime, timeToMinutes } from "./time-picker";

interface BookingAvailabilityInput {
  date: string;
  service: Service;
  staff: StaffMember[];
  staffId: string;
  openingHours: OpeningHours[];
  appointments: MockAppointment[];
}

export function getBookingSlots({
  date,
  service,
  staff,
  staffId,
  openingHours,
  appointments,
}: BookingAvailabilityInput): BookingSlot[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return [];
  }

  const selectedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    return [];
  }

  const weekday = selectedDate.getDay() || 7;
  const day = openingHours.find((item) => item.weekday === weekday);

  if (!day?.isOpen || service.durationMinutes <= 0) {
    return [];
  }

  const eligibleStaff = staff.filter(
    (person) =>
      person.serviceIds.includes(service.id) &&
      (staffId === "cualquiera" || person.id === staffId)
  );

  if (eligibleStaff.length === 0) {
    return [];
  }

  const starts = new Set<number>();

  for (const range of day.ranges) {
    const opening = timeToMinutes(range.opensAt);
    const closing = timeToMinutes(range.closesAt);

    for (
      let start = opening;
      start + service.durationMinutes <= closing;
      start += 15
    ) {
      starts.add(start);
    }
  }

  return [...starts].sort((a, b) => a - b).map((start) => {
    const end = start + service.durationMinutes;

    const availableStaffIds = eligibleStaff
      .filter((person) => {
        const hasConflict = appointments.some(
          (appointment) =>
            appointment.date === date &&
            appointment.staffId === person.id &&
            start < timeToMinutes(appointment.endsAt) &&
            end > timeToMinutes(appointment.startsAt)
        );

        return !hasConflict;
      })
      .map((person) => person.id);

    return {
      startsAt: minutesToTime(start),
      endsAt: minutesToTime(end),
      availableStaffIds,
    };
  });
}