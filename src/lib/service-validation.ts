interface ServiceDraft {
  name: string;
  durationMinutes: number;
  price: string;
}

export function validateServiceDraft({
  name,
  durationMinutes,
  price,
}: ServiceDraft): string | null {
  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return "El nombre debe tener entre 2 y 80 caracteres.";
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < 1 ||
    durationMinutes > 1440
  ) {
    return "La duración debe ser de 1 a 1440 minutos enteros.";
  }

  const priceText = price.trim();
  const priceMxn = Number(priceText);
  const pricePattern = /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/;

  if (
    !pricePattern.test(priceText) ||
    !Number.isFinite(priceMxn) ||
    priceMxn < 0
  ) {
    return "Escribe un precio válido con hasta dos decimales.";
  }

  return null;
}