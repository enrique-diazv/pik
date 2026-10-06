"use client";

import styles from "./onboarding.module.css";
import { useState, type FormEvent } from "react";
import type { Service } from "@/types/business";
import { validateServiceDraft } from "@/lib/service-validation";
import { useCardActions } from "./use-card-actions";
import {
  IconlyDelete,
  IconlyEdit,
  IconlyInfomenu,
} from "./schedule-icons";

const durationOptions = [15, 20, 30, 45, 60, 120];

interface BusinessServicesFormProps {
  values: Service[];
  onChange: (values: Service[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function BusinessServicesForm({
  values,
  onChange,
  onContinue,
  onBack,
}: BusinessServicesFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState<number | null>(45);
  const [customDuration, setCustomDuration] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const {
    openId,
    setOpenId,
    startSwipe,
    moveSwipe,
    endSwipe,
  } = useCardActions(editingId !== null);
  const canAddService =
    validateServiceDraft({
      name,
      durationMinutes: duration ?? Number(customDuration),
      price,
    }) === null;
  function handleAddService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const durationMinutes = duration ?? Number(customDuration);
    const priceText = String(formData.get("priceMxn") ?? "").trim();
    const priceMxn = Number(priceText);

    if (name.length < 2 || name.length > 80) {
      setError("El nombre debe tener entre 2 y 80 caracteres.");
      return;
    }

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 1 ||
      durationMinutes > 1440
    ) {
      setError("La duración debe ser de 1 a 1440 minutos enteros.");
      return;
    }

    const pricePattern = /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/;

    if (
      !pricePattern.test(priceText) ||
      !Number.isFinite(priceMxn) ||
      priceMxn < 0
    ) {
      setError("Escribe un precio válido con hasta dos decimales.");
      return;
    }

    let serviceNumber = 1;

    while (values.some((service) => service.id === `service-${serviceNumber}`)) {
      serviceNumber += 1;
    }

    const newService: Service = {
      id: editingId ?? `service-${serviceNumber}`,
      name,
      durationMinutes,
      priceMxn,
    };

    onChange(
      editingId === null
        ? [...values, newService]
        : values.map((service) =>
          service.id === editingId ? newService : service
        )
    );

    form.reset();
    resetDraft();
  }

  function resetDraft() {
    setName("");
    setPrice("");
    setDuration(45);
    setCustomDuration("");
    setError("");
    setEditingId(null);
    setOpenId(null);
  }
  return (
    <form
      className={styles.form}
      onSubmit={handleAddService}
      onChange={() => setError("")}
    >
      <div className={styles.field}>
        <label htmlFor="service-name">Nombre del servicio</label>

        <input
          id="service-name"
          name="name"
          type="text"
          placeholder="Ej. Corte de cabello"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          minLength={2}
          maxLength={80}
          required
        />
      </div>

      <fieldset className={styles.categoryFieldset}>
        <legend>Duración del servicio</legend>

        <div className={styles.categoryList}>
          {durationOptions.map((minutes) => (
            <label key={minutes} className={styles.categoryOption}>
              <input
                type="radio"
                name="durationMinutes"
                value={minutes}
                checked={duration === minutes}
                onChange={() => {
                  setDuration(minutes);
                  setCustomDuration("");
                }}
                required={duration !== null}
              />

              <span>
                {minutes % 60 === 0
                  ? `${minutes / 60} h`
                  : `${minutes} min`}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="service-custom-duration">
          Otra duración (minutos)
        </label>

        <input
          id="service-custom-duration"
          name="customDuration"
          type="number"
          inputMode="numeric"
          placeholder="Escribe la duración en minutos"
          min={1}
          max={1440}
          step={1}
          value={customDuration}
          onChange={(event) => {
            setCustomDuration(event.currentTarget.value);
            setDuration(null);
          }}
          required={duration === null}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="service-price">Precio (MXN)</label>

        <input
          id="service-price"
          name="priceMxn"
          type="number"
          inputMode="decimal"
          placeholder="Ej. 350.00"
          min={0}
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.currentTarget.value)}
          required
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={`${styles.nextButton} ${styles.formActionButton}`}
        disabled={!canAddService}
      >
        {editingId === null ? "Agregar" : "Guardar"}
      </button>

      {editingId !== null && (
        <button
          type="button"
          className={`${styles.backButton} ${styles.formActionButton}`}
          onClick={resetDraft}
        >
          Cancelar
        </button>
      )}

      {values.length > 0 && (
        <ul className={styles.serviceList} aria-label="Servicios agregados">
          {values.map((service) => (
            <li
              key={service.id}
              className={`${styles.serviceCard} ${styles.swipeCard}`}
              onPointerDown={(event) => startSwipe(service.id, event)}
              onPointerMove={moveSwipe}
              onPointerUp={endSwipe}
              onPointerCancel={endSwipe}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpenId(null);
                }
              }}
            >
              <div
                className={styles.cardContent}
                data-actions-open={openId === service.id}
              >
                <strong>{service.name}</strong>

                <span>
                  {service.durationMinutes % 60 === 0
                    ? `${service.durationMinutes / 60} h`
                    : `${service.durationMinutes} min`}
                  {" · "}
                  ${service.priceMxn.toFixed(2)} MXN
                </span>
              </div>

              <button
                className={styles.cardMenuButton}
                data-card-controls="true"
                type="button"
                aria-label={`Opciones de ${service.name}`}
                aria-expanded={openId === service.id}
                aria-controls={`actions-${service.id}`}
                hidden={openId === service.id}
                disabled={editingId !== null}
                onClick={() => setOpenId(service.id)}
              >
                <IconlyInfomenu size={28} />
              </button>

              <div
                id={`actions-${service.id}`}
                className={styles.cardActions}
                data-card-controls="true"
                role="group"
                aria-label={`Acciones de ${service.name}`}
                hidden={openId !== service.id}
              >
                <button
                  className={styles.cardEditButton}
                  type="button"
                  aria-label={`Editar ${service.name}`}
                  onClick={() => {
                    setOpenId(null);
                    setEditingId(service.id);
                    setName(service.name);
                    setPrice(String(service.priceMxn));
                    setError("");

                    if (durationOptions.includes(service.durationMinutes)) {
                      setDuration(service.durationMinutes);
                      setCustomDuration("");
                    } else {
                      setDuration(null);
                      setCustomDuration(String(service.durationMinutes));
                    }
                  }}
                >
                  <IconlyEdit size={22} />
                </button>

                <button
                  className={styles.cardDeleteButton}
                  type="button"
                  aria-label={`Eliminar ${service.name}`}
                  onClick={() => {
                    setOpenId(null);
                    onChange(
                      values.filter((value) => value.id !== service.id)
                    );
                  }}
                >
                  <IconlyDelete size={24} />
                </button>

              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className={styles.footer} hidden={editingId !== null}>
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
    </form>
  );
}