import type { Metadata } from "next";
import { BusinessDetailsForm } from "@/components/business/business-details-form";
import styles from "@/components/business/onboarding.module.css";

export const metadata: Metadata = {
  title: "Registra tu negocio | PIK",
};

export default function BusinessOnboardingPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Tu negocio en PIK</h1>
          <h2>Datos del negocio</h2>

          <div
            className={styles.progress}
            role="progressbar"
            aria-label="Progreso del registro"
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={1}
            aria-valuetext="Paso 1 de 5: datos del negocio"
          >
            <span className={styles.activeSegment} />
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>

        <BusinessDetailsForm />
      </main>
    </div>
  );
}