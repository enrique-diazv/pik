import type { Business } from "@/types/business";

export type BusinessRegistration = Omit<Business, "id">;

export async function registerBusinessMock(
  values: BusinessRegistration
): Promise<Business> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });

  if (values.services.length === 0 || values.staff.length === 0) {
    throw new Error("Agrega al menos un servicio y una persona.");
  }

  const serviceIds = new Set(values.services.map((service) => service.id));

  const hasInvalidAssignments = values.staff.some(
    (person) =>
      person.serviceIds.length === 0 ||
      person.serviceIds.some((id) => !serviceIds.has(id))
  );

  if (hasInvalidAssignments) {
    throw new Error("Revisa los servicios asignados a cada persona.");
  }

  return {
    ...values,
    id: "business-demo",
  };
}