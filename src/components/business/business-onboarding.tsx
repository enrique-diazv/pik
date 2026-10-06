"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BusinessCategory,
  BusinessDetails,
  BusinessLocation,
  Service,
  StaffMember,
} from "@/types/business";
import { createDefaultOpeningHours } from "@/lib/opening-hours";
import { BusinessDetailsForm } from "./business-details-form";
import { BusinessCategoriesForm } from "./business-categories-form";
import { BusinessLocationForm } from "./business-location-form";
import styles from "./onboarding.module.css";
import { BusinessServicesForm } from "./business-services-form";
import { BusinessStaffForm } from "./business-staff-form";
import { BusinessSummary } from "./business-summary";

type Step =
  | "details"
  | "categories"
  | "location"
  | "services"
  | "staff"
  | "summary";

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
  summary: {
    number: 5,
    title: "Resumen",
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
  const [staff, setStaff] = useState<StaffMember[]>([]);
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

  function handleServicesChange(nextServices: Service[]) {
    const validIds = new Set(nextServices.map((service) => service.id));

    setServices(nextServices);
    setStaff((current) =>
      current.map((person) => ({
        ...person,
        serviceIds: person.serviceIds.filter((id) => validIds.has(id)),
      }))
    );
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

          {step !== "summary" && (
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
          )}
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
            onBack={(values) => {
              setLocation(values);
              setStep("categories");
            }}
          />
        )}

        {step === "services" && (
          <BusinessServicesForm
            values={services}
            onChange={handleServicesChange}
            onContinue={() => setStep("staff")}
            onBack={() => setStep("location")}
          />
        )}

        {step === "staff" && (
          <BusinessStaffForm
            services={services}
            values={staff}
            onChange={setStaff}
            onContinue={() => setStep("summary")}
            onBack={() => setStep("services")}
          />
        )}

        {step === "summary" && (
          <BusinessSummary
            details={details}
            categories={categories}
            location={location}
            services={services}
            staff={staff}
            onBack={() => setStep("staff")}
          />
        )}
      </main>
    </div>
  );
}