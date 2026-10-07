"use client";

import { useState } from "react";
import type {
  OpeningHours,
  Service,
  StaffMember,
} from "@/types/business";
import { getBookingAppointments } from "@/data/mocks/booking-reservations";
import { getBookingSlots } from "@/lib/booking-availability";
import { timeToMinutes } from "@/lib/time-picker";
import styles from "./booking-date-picker.module.css";

interface BookingDatePickerProps {
  service: Service;
  staff: StaffMember[];
  staffId: string;
  openingHours: OpeningHours[];
  value: string;
  onChange: (date: string) => void;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const weekdayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function BookingDatePicker({
  service,
  staff,
  staffId,
  openingHours,
  value,
  onChange,
}: BookingDatePickerProps) {
  const [now] = useState(() => new Date());
  const today = formatDate(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dates = Array.from({ length: 9 }, (_, offset) => {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);

    return date;
  });

  return (
    <div className={styles.dateGrid} role="group" aria-label="Elige una fecha">
      {dates.map((date) => {
        const dateValue = formatDate(date);

        const slots = getBookingSlots({
          date: dateValue,
          service,
          staff,
          staffId,
          openingHours,
          appointments: getBookingAppointments(dateValue, staff),
        });

        const hasAvailability = slots.some(
          (slot) =>
            slot.availableStaffIds.length > 0 &&
            (dateValue !== today ||
              timeToMinutes(slot.startsAt) > currentMinutes)
        );

        return (
          <button
            key={dateValue}
            type="button"
            className={styles.dateButton}
            disabled={!hasAvailability}
            aria-pressed={value === dateValue}
            aria-label={date.toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            onClick={() => onChange(dateValue)}
          >
            <span>{weekdayLabels[date.getDay()]}</span>
            <strong>{date.getDate()}</strong>
          </button>
        );
      })}
    </div>
  );
}