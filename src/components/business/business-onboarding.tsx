"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BusinessCategory,
  BusinessDetails,
} from "@/types/business";
import { BusinessDetailsForm } from "./business-details-form";
import { BusinessCategoriesForm } from "./business-categories-form";
import styles from "./onboarding.module.css";

type Step = "details" | "categories";

export function BusinessOnboarding() {
  const [step, setStep] = useState<Step>("details");

  const [details, setDetails] = useState<BusinessDetails>({
    name: "",
    phone: "",
    description: "",
  });

  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const currentStep = step === "details" ? 1 : 2;
  const title = step === "details" ? "Datos del negocio" : "Categorías";

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function handleDetailsContinue(values: BusinessDetails) {
    setDetails(values);
    setStep("categories");
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
          />
        )}
      </main>
    </div>
  );
}