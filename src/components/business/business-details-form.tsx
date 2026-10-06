"use client";

import { useState, type FormEvent } from "react";
import type { BusinessDetails } from "@/types/business";
import styles from "./onboarding.module.css";

interface BusinessDetailsFormProps {
  initialValues: BusinessDetails;
  onContinue: (values: BusinessDetails) => void;
}

export function BusinessDetailsForm({
  initialValues,
  onContinue,
}: BusinessDetailsFormProps) {
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (name.length < 2) {
      setError("Escribe un nombre de al menos dos caracteres.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Escribe un teléfono de 10 dígitos.");
      return;
    }

    setError("");
    onContinue({ name, phone, description });
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={() => setError("")}
    >
      <div className={styles.field}>
        <label htmlFor="business-name">Nombre del negocio</label>
        <input
          id="business-name"
          name="name"
          type="text"
          defaultValue={initialValues.name}
          placeholder="Ej. Casa Naranja"
          autoComplete="organization"
          required
          minLength={2}
          maxLength={80}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="business-phone">Número de teléfono</label>
        <input
          id="business-phone"
          name="phone"
          type="tel"
          defaultValue={initialValues.phone}
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="5512345678"
          title="Escribe 10 dígitos, sin espacios ni código de país."
          required
          pattern="[0-9]{10}"
          maxLength={10}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="business-description">
          Descripción del negocio <span>(opcional)</span>
        </label>
        <textarea
          id="business-description"
          name="description"
          defaultValue={initialValues.description}
          placeholder="Cuéntanos de tu negocio"
          maxLength={1000}
          rows={6}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <button className={styles.nextButton} type="submit">
            Siguiente
          </button>
        </div>
      </footer>
    </form>
  );
}