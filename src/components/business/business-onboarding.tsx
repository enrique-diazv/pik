"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BusinessCategory,
  BusinessDetails,
  BusinessLocation,
  Service,
} from "@/types/business";
import { createDefaultOpeningHours } from "@/lib/opening-hours";
import { BusinessDetailsForm } from "./business-details-form";
import { BusinessCategoriesForm } from "./business-categories-form";
import { BusinessLocationForm } from "./business-location-form";
import styles from "./onboarding.module.css";
import { BusinessServicesForm } from "./business-services-form";

type Step =
  | "details"
  | "categories"
  | "location"
  | "services"
  | "staff";

const steps = {
  details: {
    number: 1,
    title: "Datos del negocio",
  },
  categories: {
    number: 2,
    title: "Categorías",
  },
  location: {
    number: 3,
    title: "Ubicación y horarios",
  },
  services: {
    number: 4,
    title: "Servicios",
  },
  staff: {
    number: 5,
    title: "Staff",
  },
};

export function BusinessOnboarding() {
  const [step, setStep] = useState<Step>("details");

  const [details, setDetails] = useState<BusinessDetails>({
    name: "",
    phone: "",
    description: "",
  });

  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [location, setLocation] = useState<BusinessLocation>(() => ({
    city: "",
    address: "",
    openingHours: createDefaultOpeningHours(),
  }));

  const headingRef = useRef<HTMLHeadingElement>(null);
  const { number: currentStep, title } = steps[step];

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function handleDetailsContinue(values: BusinessDetails) {
    setDetails(values);
    setStep("categories");
  }

  function handleLocationContinue(values: BusinessLocation) {
    setLocation(values);
    setStep("services");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Tu negocio en PIK</h1>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className={styles.stepTitle}
          >
            {title}
          </h2>

          <div
            className={styles.progress}
            role="progressbar"
            aria-label="Progreso del registro"
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={currentStep}
            aria-valuetext={`Paso ${currentStep} de 5: ${title}`}
          >
            {[1, 2, 3, 4, 5].map((number) => (
              <span
                key={number}
                className={
                  number <= currentStep
                    ? styles.activeSegment
                    : undefined
                }
              />
            ))}
          </div>
        </header>

        {step === "details" && (
          <BusinessDetailsForm
            initialValues={details}
            onContinue={handleDetailsContinue}
          />
        )}

        {step === "categories" && (
          <BusinessCategoriesForm
            values={categories}
            onChange={setCategories}
            onBack={() => setStep("details")}
            onContinue={() => setStep("location")}
          />
        )}

        {step === "location" && (
          <BusinessLocationForm
            initialValues={location}
            onContinue={handleLocationContinue}
            onBack={() => setStep("categories")}
          />
        )}

        {step === "services" && (
          <BusinessServicesForm
            values={services}
            onChange={setServices}
            onContinue={() => setStep("staff")}
            onBack={() => setStep("location")}
          />
        )}

        {step === "staff" && (
          <section className={styles.form} aria-label="Equipo del negocio">
            <p>Aún no agregaste personas a tu equipo.</p>

            <footer className={styles.footer}>
              <div
                className={`${styles.footerContent} ${styles.footerWithBack}`}
              >
                <button
                  className={styles.backButton}
                  type="button"
                  onClick={() => setStep("services")}
                >
                  Atrás
                </button>
              </div>
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}