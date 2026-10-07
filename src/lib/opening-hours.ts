import type { OpeningHours, TimeRange } from "@/types/business";

export function canAddOpeningRange(ranges: TimeRange[]): boolean {
  const lastRange = ranges.at(-1);

  if (!lastRange) {
    return true;
  }

  // La nueva apertura debe superar el cierre anterior y dejar un minuto de atención.
  return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(lastRange.closesAt) &&
    lastRange.closesAt <= "23:57";
}

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
