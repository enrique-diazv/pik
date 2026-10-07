import type { StaffMember } from "@/types/business";
import type { MockAppointment } from "@/types/booking";

export function getMockAppointments(
  date: string,
  staff: StaffMember[]
): MockAppointment[] {
  const appointments: MockAppointment[] = staff.map((person) => ({
    id: `${date}-${person.id}-shared`,
    staffId: person.id,
    date,
    startsAt: "10:00",
    endsAt: "11:00",
  }));

  if (staff[0]) {
    appointments.push({
      id: `${date}-${staff[0].id}-morning`,
      staffId: staff[0].id,
      date,
      startsAt: "09:00",
      endsAt: "10:00",
    });
  }

  return appointments;
}