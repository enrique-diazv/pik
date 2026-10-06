import type { OpeningHours } from "@/types/business";

export const weekdays = [
  { weekday: 1, label: "Lunes" },
  { weekday: 2, label: "Martes" },
  { weekday: 3, label: "Miércoles" },
  { weekday: 4, label: "Jueves" },
  { weekday: 5, label: "Viernes" },
  { weekday: 6, label: "Sábado" },
  { weekday: 7, label: "Domingo" },
];

export function createDefaultOpeningHours(): OpeningHours[] {
  return weekdays.map((day) => ({
    weekday: day.weekday,
    isOpen: day.weekday !== 7,
    ranges: day.weekday === 7
      ? []
      : [{ opensAt: "09:00", closesAt: "18:00" }],
  }));
}