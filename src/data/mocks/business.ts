import type { Business } from "@/types/business";

/** Fictional data, separate from the real app and its users. */
export const mockBusiness: Business = {
  id: "salon-demo",
  name: "Casa Naranja",
  category: "salon",
  phone: "5500000000",
  address: "Calle Ejemplo 123, Monterrey, Nuevo León",
  description: "Un espacio para cuidar de ti, a tu ritmo.",
  openingHours: Array.from({ length: 7 }, (_, index) => ({
    weekday: index + 1,
    isOpen: index !== 6,
    opensAt: "09:00",
    closesAt: "18:00",
  })),
  services: [
    { id: "corte", name: "Corte de cabello", durationMinutes: 45, priceMxn: 350 },
    { id: "manicure", name: "Manicure", durationMinutes: 60, priceMxn: 450 },
    { id: "tratamiento", name: "Tratamiento capilar", durationMinutes: 30, priceMxn: 280 },
  ],
  staff: [
    { id: "ana", name: "Ana", serviceIds: ["corte", "tratamiento"] },
    { id: "sofia", name: "Sofía", serviceIds: ["manicure", "tratamiento"] },
  ],
};
