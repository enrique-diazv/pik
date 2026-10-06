"use client";

import { useState, type FormEvent } from "react";
import type { Business } from "@/types/business";
import styles from "./onboarding.module.css";

type BusinessDetails = Pick<Business, "name" | "phone" | "description">;

export function BusinessDetailsForm() {
  const [savedDetails, setSavedDetails] = useState<BusinessDetails | null>(null);
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
    setSavedDetails({ name, phone, description });
  }

  function handleChange() {
    setError("");
    setSavedDetails(null);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <div className={styles.field}>
        <label htmlFor="business-name">Nombre del negocio</label>
        <input
          id="business-name"
          name="name"
          type="text"
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

      {savedDetails && (
        <p className={styles.success} role="status">
          Datos de {savedDetails.name} listos para continuar.
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