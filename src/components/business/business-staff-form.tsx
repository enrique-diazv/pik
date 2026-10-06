"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Service, StaffMember } from "@/types/business";
import styles from "./onboarding.module.css";
import {
  IconlyDelete,
  IconlyEdit,
  IconlyInfomenu,
} from "./schedule-icons";

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
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const swipeStart = useRef<{
    pointerId: number;
    personId: string;
    x: number;
    y: number;
  } | null>(null);
  const trimmedName = name.trim();
  const canAdd =
    trimmedName.length >= 2 &&
    trimmedName.length <= 80 &&
    serviceIds.length > 0 &&
    serviceIds.every((id) => services.some((service) => service.id === id));
  const canContinue =
    values.length > 0 &&
    values.every(
      (person) =>
        person.serviceIds.length > 0 &&
        person.serviceIds.every((id) =>
          services.some((service) => service.id === id)
        )
    );

  useEffect(() => {
    function closeActions(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-card-controls]")
      ) {
        return;
      }

      setOpenActionsId(null);
    }

    document.addEventListener("pointerdown", closeActions);

    return () => {
      document.removeEventListener("pointerdown", closeActions);
    };
  }, []);

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
            <li
              key={person.id}
              className={`${styles.serviceCard} ${styles.swipeCard}`}
              onPointerDown={(event) => {
                if (
                  editingId !== null ||
                  !event.isPrimary ||
                  event.button !== 0 ||
                  (event.target instanceof Element &&
                    event.target.closest("button"))
                ) {
                  return;
                }

                swipeStart.current = {
                  pointerId: event.pointerId,
                  personId: person.id,
                  x: event.clientX,
                  y: event.clientY,
                };

                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const start = swipeStart.current;

                if (
                  !start ||
                  start.pointerId !== event.pointerId ||
                  start.personId !== person.id ||
                  editingId !== null
                ) {
                  return;
                }

                const distanceX = event.clientX - start.x;
                const distanceY = event.clientY - start.y;

                if (
                  Math.abs(distanceX) < 30 ||
                  Math.abs(distanceX) <= Math.abs(distanceY) * 1.5
                ) {
                  return;
                }

                if (distanceX < 0) {
                  setOpenActionsId(person.id);
                } else {
                  setOpenActionsId((current) =>
                    current === person.id ? null : current
                  );
                }

                swipeStart.current = null;
              }}
              onPointerUp={() => {
                swipeStart.current = null;
              }}
              onPointerCancel={() => {
                swipeStart.current = null;
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpenActionsId(null);
                }
              }}
            >
              <div
                className={styles.cardContent}
                data-actions-open={openActionsId === person.id}
              >
                <strong>{person.name}</strong>

                <span>
                  {services
                    .filter((service) => person.serviceIds.includes(service.id))
                    .map((service) => service.name)
                    .join(", ")}
                </span>
              </div>

              <button
                className={styles.cardMenuButton}
                data-card-controls="true"
                type="button"
                aria-label={`Opciones de ${person.name}`}
                aria-expanded={openActionsId === person.id}
                aria-controls={`actions-${person.id}`}
                hidden={openActionsId === person.id}
                disabled={editingId !== null}
                onClick={() => setOpenActionsId(person.id)}
              >
                <IconlyInfomenu size={28} />
              </button>

              <div
                id={`actions-${person.id}`}
                className={styles.cardActions}
                data-card-controls="true"
                role="group"
                aria-label={`Acciones de ${person.name}`}
                hidden={openActionsId !== person.id}
              >
                <button
                  className={styles.cardEditButton}
                  type="button"
                  aria-label={`Editar a ${person.name}`}
                  onClick={() => {
                    setOpenActionsId(null);
                    setEditingId(person.id);
                    setName(person.name);
                    setServiceIds([...person.serviceIds]);
                  }}
                >
                  <IconlyEdit size={22} />
                </button>

                <button
                  className={styles.cardDeleteButton}
                  type="button"
                  aria-label={`Eliminar a ${person.name}`}
                  onClick={() => {
                    setOpenActionsId(null);
                    removePerson(person.id);
                  }}
                >
                  <IconlyDelete size={24} />
                </button>
              </div>
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
              disabled={!canContinue}
              onClick={() => {
                if (canContinue) {
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