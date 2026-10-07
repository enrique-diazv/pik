"use client";

import type {
  BusinessCategory,
  BusinessDetails,
  BusinessLocation,
  Service,
  StaffMember,
  Business,
} from "@/types/business";
import { weekdays } from "@/lib/opening-hours";
import styles from "./onboarding.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerBusinessMock } from "@/data/mocks/business-registration";

const categoryLabels: Record<BusinessCategory, string> = {
  salon: "Salón",
  barbershop: "Barbería",
  spa: "Spa",
  nails: "Estudio de uñas",
  massage: "Masaje",
  podiatry: "Podología",
  physiotherapy: "Fisioterapia",
};

interface BusinessSummaryProps {
  details: BusinessDetails;
  categories: BusinessCategory[];
  location: BusinessLocation;
  services: Service[];
  staff: StaffMember[];
  onBack: () => void;
}

export function BusinessSummary({
  details,
  categories,
  location,
  services,
  staff,
  onBack,
}: BusinessSummaryProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [registeredBusiness, setRegisteredBusiness] =
    useState<Business | null>(null);
  useEffect(() => {
    if (registeredBusiness !== null) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [registeredBusiness]);
  async function handleConfirm() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const result = await registerBusinessMock({
        ...details,
        categories,
        ...location,
        services,
        staff,
      });

      setRegisteredBusiness(result);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No pudimos registrar el negocio. Intenta nuevamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (registeredBusiness !== null) {
    return (
      <section className={styles.form} aria-label="Registro completado">
        <div className={styles.serviceCard} role="status">
          <p className={styles.success}>Registro completado</p>
          <p>
            <strong>{registeredBusiness.name}</strong> quedó registrado.
          </p>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <button
              className={styles.backButton}
              type="button"
              onClick={() => router.push("/")}
            >
              Cerrar el resumen
            </button>
          </div>
        </footer>
      </section>
    );
  }

  return (
    <section
      className={`${styles.form} ${styles.summary}`}
      aria-label="Resumen del registro"
    >
      <section className={styles.field}>
        <h3 className={styles.summaryHeading}>Información del negocio</h3>

        <div className={styles.serviceCard}>
          <dl className={styles.summaryDetails}>
            <dt>Nombre del negocio</dt>
            <dd>{details.name}</dd>

            <dt>Número de teléfono</dt>
            <dd>{details.phone}</dd>

            <dt>Descripción</dt>
            <dd>{details.description.trim() || "Sin descripción"}</dd>
          </dl>
        </div>
      </section>

      <section className={styles.field}>
        <h3 className={styles.summaryHeading}>Categorías</h3>

        <div className={styles.serviceCard}>
          {categories.map((category) => (
            <p key={category}>{categoryLabels[category]}</p>
          ))}
        </div>
      </section>

      <section className={styles.field}>
        <h3 className={styles.summaryHeading}>Ubicación</h3>

        <div className={styles.serviceCard}>
          <dl className={styles.summaryDetails}>
            <dt>Ciudad</dt>
            <dd>{location.city}</dd>

            <dt>Dirección</dt>
            <dd>{location.address}</dd>
          </dl>
        </div>
      </section>

      <section className={styles.field}>
        <h3 className={styles.summaryHeading}>Horarios</h3>

        <div className={styles.serviceCard}>
          {location.openingHours.map((day) => (
            <dl key={day.weekday} className={styles.summaryDetails}>
              <dt>
                {weekdays.find((value) => value.weekday === day.weekday)?.label}
              </dt>

              <dd>
                {day.isOpen
                  ? day.ranges
                    .map((range) => `${range.opensAt} - ${range.closesAt}`)
                    .join(" · ")
                  : "Cerrado"}
              </dd>
            </dl>
          ))}
        </div>
      </section>

      <section className={styles.field}>
        <h3 className={styles.summaryHeading}>Servicios</h3>

        <div className={styles.serviceCard}>
          {services.map((service) => (
            <dl key={service.id} className={styles.summaryDetails}>
              <dt>{service.name}</dt>

              <dd>
                {service.durationMinutes % 60 === 0
                  ? `${service.durationMinutes / 60} h`
                  : `${service.durationMinutes} min`}
                {" · "}
                ${service.priceMxn.toFixed(2)} MXN
              </dd>
            </dl>
          ))}
        </div>
      </section>

      <section className={styles.field}>
        <h3 className={styles.summaryHeading}>Staff</h3>

        <div className={styles.serviceCard}>
          {staff.map((person) => (
            <dl key={person.id} className={styles.summaryDetails}>
              <dt>{person.name}</dt>

              <dd>
                {services
                  .filter((service) => person.serviceIds.includes(service.id))
                  .map((service) => service.name)
                  .join(", ") || "Sin servicios asignados"}
              </dd>
            </dl>
          ))}
        </div>
      </section>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <footer className={styles.footer}>
        <div className={`${styles.footerContent} ${styles.footerWithBack}`}>
          <button
            className={styles.backButton}
            type="button"
            disabled={isSaving}
            onClick={onBack}
          >
            Atrás
          </button>

          <button
            className={styles.nextButton}
            type="button"
            disabled={isSaving}
            onClick={handleConfirm}
          >
            {isSaving ? "Registrando…" : "Confirmar"}
          </button>
        </div>
      </footer>
    </section>
  );
}