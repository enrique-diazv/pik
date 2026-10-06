export function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

export function minutesToTime(total: number): string {
  const hour = Math.floor(total / 60);
  const minute = total % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getTimeOptions(
  minimum: number,
  maximum: number,
  selectedHour: string
) {
  const hours = Array.from({ length: 24 }, (_, index) => index)
    .filter(
      (hour) => hour * 60 + 59 >= minimum && hour * 60 <= maximum
    )
    .map((hour) => String(hour).padStart(2, "0"));

  const minutes = Array.from({ length: 60 }, (_, index) => index)
    .filter((minute) => {
      const total = Number(selectedHour) * 60 + minute;

      return total >= minimum && total <= maximum;
    })
    .map((minute) => String(minute).padStart(2, "0"));

  return { hours, minutes };
}