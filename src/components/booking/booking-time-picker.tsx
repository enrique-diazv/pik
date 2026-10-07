"use client";

import { useState } from "react";
import type {
  OpeningHours,
  Service,
  StaffMember,
} from "@/types/business";
import type { BookingSlot } from "@/types/booking";
import { getBookingAppointments } from "@/data/mocks/booking-reservations";
import { getBookingSlots } from "@/lib/booking-availability";
import { timeToMinutes } from "@/lib/time-picker";
import styles from "./booking-time-picker.module.css";

interface BookingTimePickerProps {
  date: string;
  service: Service;
  staff: StaffMember[];
  staffId: string;
  openingHours: OpeningHours[];
  value: BookingSlot | null;
  onChange: (slot: BookingSlot) => void;
}

export function BookingTimePicker({
  date,
  service,
  staff,
  staffId,
  openingHours,
  value,
  onChange,
}: BookingTimePickerProps) {
  const [now] = useState(() => new Date());

  if (!date) {
    return <p className={styles.message}>Elige una fecha para ver los horarios.</p>;
  }

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slots = getBookingSlots({
    date,
    service,
    staff,
    staffId,
    openingHours,
    appointments: getBookingAppointments(date, staff),
  });

  return (
    <fieldset className={styles.fieldset}>
      <legend>Horarios</legend>

      <div className={styles.timeGrid}>
        {slots.map((slot) => {
          const isPast =
            date === today &&
            timeToMinutes(slot.startsAt) <= currentMinutes;

          const isUnavailable =
            isPast || slot.availableStaffIds.length === 0;

          return (
            <button
              key={slot.startsAt}
              type="button"
              className={styles.timeButton}
              disabled={isUnavailable}
              aria-pressed={value?.startsAt === slot.startsAt}
              aria-label={`${slot.startsAt} a ${slot.endsAt}`}
              onClick={() => onChange(slot)}
            >
              {slot.startsAt.replace(/^0/, "")}
            </button>
          );
        })}
      </div>

      {slots.length === 0 && (
        <p className={styles.message}>No hay horarios para esta fecha.</p>
      )}
    </fieldset>
  );
}