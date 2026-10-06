"use client";

import { useState, type FormEvent } from "react";
import type { Service, StaffMember } from "@/types/business";
import styles from "./onboarding.module.css";
import { IconlyDelete } from "./schedule-icons";

interface BusinessStaffFormProps {
  services: Service[];
  values: StaffMember[];
  onChange: (values: StaffMember[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function BusinessStaffForm({
  services,
  values,
  onChange,
  onContinue,
  onBack,
}: BusinessStaffFormProps) {
  const [name, setName] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const trimmedName = name.trim();
  const canAdd =
    trimmedName.length >= 2 &&
    trimmedName.length <= 80 &&
    serviceIds.length > 0 &&
    serviceIds.every((id) => services.some((service) => service.id === id));

  function toggleService(id: string) {
    setServiceIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  function resetDraft() {
    setName("");
    setServiceIds([]);
    setEditingId(null);
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canAdd) {
      return;
    }

    if (editingId !== null) {
      onChange(
        values.map((person) =>
          person.id === editingId
            ? { ...person, name: trimmedName, serviceIds: [...serviceIds] }
            : person
        )
      );
    } else {
      let staffNumber = 1;

      while (values.some((person) => person.id === `staff-${staffNumber}`)) {
        staffNumber += 1;
      }

      onChange([
        ...values,
        {
          id: `staff-${staffNumber}`,
          name: trimmedName,
          serviceIds: [...serviceIds],
        },
      ]);
    }

    resetDraft();
  }

  function removePerson(id: string) {
    onChange(values.filter((person) => person.id !== id));

    if (editingId === id) {
      resetDraft();
    }
  }

  return (
    <form className={styles.form} onSubmit={handleAdd}>
      <div className={styles.field}>
        <label htmlFor="staff-name">Nombre de la persona</label>
        <input
          id="staff-name"
          name="name"
          type="text"
          placeholder="Ej. Ana"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          minLength={2}
          maxLength={80}
          required
        />
      </div>

      <fieldset className={styles.categoryFieldset}>
        <legend>Servicios que realiza</legend>

        <div className={styles.categoryList}>
          {services.map((service) => (
            <label key={service.id} className={styles.categoryOption}>
              <input
                type="checkbox"
                name="serviceIds"
                value={service.id}
                checked={serviceIds.includes(service.id)}
                onChange={() => toggleService(service.id)}
              />
              <span>{service.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        className={`${styles.nextButton} ${styles.formActionButton}`}
        type="submit"
        disabled={!canAdd}
      >
        {editingId === null ? "Agregar" : "Guardar"}
      </button>

      {editingId !== null && (
        <button
          className={`${styles.backButton} ${styles.formActionButton}`}
          type="button"
          onClick={resetDraft}
        >
          Cancelar
        </button>
      )}

      {values.length > 0 && (
        <ul className={styles.serviceList} aria-label="Personas agregadas">
          {values.map((person) => (
            <li key={person.id} className={styles.serviceCard}>
              <div className={styles.staffCardHeading}>
                <strong>{person.name}</strong>

                <button
                  className={styles.editHoursButton}
                  type="button"
                  aria-label={`Editar a ${person.name}`}
                  onClick={() => {
                    setEditingId(person.id);
                    setName(person.name);
                    setServiceIds([...person.serviceIds]);
                  }}
                >
                  Editar
                </button>

                <button
                  className={styles.deleteRangeButton}
                  type="button"
                  aria-label={`Eliminar a ${person.name}`}
                  onClick={() => removePerson(person.id)}
                >
                  <IconlyDelete />
                </button>
              </div>
              <span>
                {services
                  .filter((service) => person.serviceIds.includes(service.id))
                  .map((service) => service.name)
                  .join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}

      {editingId === null && (
        <footer className={styles.footer}>
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
              type="button"
              disabled={values.length === 0}
              onClick={() => {
                if (values.length > 0) {
                  onContinue();
                }
              }}
            >
              Siguiente
            </button>
          </div>
        </footer>
      )}
    </form>
  );
}