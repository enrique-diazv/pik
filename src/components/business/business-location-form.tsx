"use client";
import { CitySelect } from "./city-select";
import { useCallback, useState, type FormEvent } from "react";
import type { BusinessLocation, OpeningHours } from "@/types/business";
import styles from "./onboarding.module.css";
import { createDefaultOpeningHours } from "@/lib/opening-hours";
import { OpeningHoursEditor } from "./opening-hours-editor";

const cities = [
  "Monterrey",
  "Guadalajara",
  "Ciudad de México",
];

interface BusinessLocationFormProps {
  initialValues: BusinessLocation;
  onContinue: (values: BusinessLocation) => void;
  onBack: () => void;
}

export function BusinessLocationForm({
  initialValues,
  onContinue,
  onBack,
}: BusinessLocationFormProps) {
  const [error, setError] = useState("");
  const [city, setCity] = useState(initialValues.city);
  const [address, setAddress] = useState(initialValues.address);

  const canContinue =
    cities.includes(city) &&
    address.trim().length >= 5 &&
    address.trim().length <= 200;
  const [openingHours, setOpeningHours] = useState(() =>
    initialValues.openingHours.length > 0
      ? initialValues.openingHours
      : createDefaultOpeningHours()
  );
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [draftHours, setDraftHours] = useState<OpeningHours[]>([]);
  const [pendingRangeIds, setPendingRangeIds] = useState<string[]>([]);

  const handlePickerChange = useCallback(
    (rangeId: string, isPicking: boolean) => {
      setPendingRangeIds((current) => {
        if (isPicking === current.includes(rangeId)) {
          return current;
        }

        return isPicking
          ? [...current, rangeId]
          : current.filter((id) => id !== rangeId);
      });
    },
    []
  );

  function startEditingHours() {
    setDraftHours(
      openingHours.map((day) => ({
        ...day,
        ranges: day.ranges.map((range, index) => ({
          ...range,
          id: range.id ?? `day-${day.weekday}-range-${index}`,
        })),
      }))
    );

    setError("");
    setIsEditingHours(true);
  }

  function saveHours() {
    if (pendingRangeIds.length > 0) {
      setError("Confirma los horarios abiertos antes de guardar.");
      return;
    }
    const timePattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

    for (const day of draftHours) {
      const sortedRanges = [...day.ranges].sort((first, second) =>
        first.opensAt.localeCompare(second.opensAt)
      );

      for (const [index, range] of sortedRanges.entries()) {
        if (
          !timePattern.test(range.opensAt) ||
          !timePattern.test(range.closesAt)
        ) {
          setError("Completa y confirma cada horario antes de guardar.");
          return;
        }

        if (range.opensAt >= range.closesAt) {
          setError("Cada cierre debe ser posterior a su apertura.");
          return;
        }

        const previousRange = sortedRanges[index - 1];

        if (previousRange && range.opensAt < previousRange.closesAt) {
          setError("Los horarios de un mismo día no deben solaparse.");
          return;
        }
      }
    }

    setOpeningHours(draftHours);
    setError("");
    setIsEditingHours(false);
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEditingHours) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const city = String(formData.get("city") ?? "");
    const address = String(formData.get("address") ?? "").trim();

    if (!cities.includes(city)) {
      setError("Selecciona una ciudad.");
      return;
    }

    if (address.length < 5) {
      setError("Escribe una dirección de al menos cinco caracteres.");
      return;
    }

    setError("");

    onContinue({
      ...initialValues,
      city,
      address,
      openingHours,
    });
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={() => setError("")}
    >
      <div className={styles.field}>
        <label htmlFor="business-city">Ciudad</label>

        <CitySelect
          initialValue={initialValues.city}
          options={cities}
          onValueChange={(value) => {
            setCity(value);
            setError("");
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="business-address">Dirección</label>
        <input
          id="business-address"
          name="address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.currentTarget.value)}
          autoComplete="street-address"
          placeholder="Calle, número y colonia"
          required
          minLength={5}
          maxLength={200}
        />
      </div>
      <OpeningHoursEditor
        values={isEditingHours ? draftHours : openingHours}
        onChange={isEditingHours ? setDraftHours : setOpeningHours}
        isEditing={isEditingHours}
        onEdit={startEditingHours}
        onPickerChange={handlePickerChange}
        pendingRangeIds={pendingRangeIds}
      />
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <footer className={styles.footer}>
        {isEditingHours ? (
          <div className={`${styles.footerContent} ${styles.footerCentered}`}>
            {pendingRangeIds.length > 0 && (
              <p className={styles.pendingHoursMessage} role="status">
                Confirma cada horario con el icono de listo.
              </p>
            )}

            <button
              className={styles.nextButton}
              type="button"
              onClick={saveHours}
              disabled={pendingRangeIds.length > 0}
            >
              Guardar
            </button>
          </div>
        ) : (
          <div className={`${styles.footerContent} ${styles.footerWithBack}`}>
            <button
              className={styles.backButton}
              type="button"
              onClick={onBack}
            >
              Atrás
            </button>

            <button
              className={styles.nextButton}
              type="submit"
              disabled={!canContinue}
            >
              Siguiente
            </button>
          </div>
        )}
      </footer>
    </form>
  );
}