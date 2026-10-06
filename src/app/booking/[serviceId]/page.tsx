import Link from "next/link";
import { notFound } from "next/navigation";
import { mockBusiness } from "@/data/mocks/business";
import styles from "@/components/business/onboarding.module.css";
import profileStyles from "@/components/booking/booking.module.css";

interface BookingServicePageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function BookingServicePage({
  params,
}: BookingServicePageProps) {
  const { serviceId } = await params;
  const service = mockBusiness.services.find(
    (item) => item.id === serviceId
  );

  if (!service) {
    notFound();
  }

  const availableStaff = mockBusiness.staff.filter(
    (person) => person.serviceIds.includes(service.id)
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={profileStyles.header}>
          <h1 className={profileStyles.name}>{service.name}</h1>
          <p className={profileStyles.contact}>
            {mockBusiness.name}
          </p>
        </header>

        <section className={styles.form} aria-label="Staff disponible">
          <h2 className={styles.summaryHeading}>Staff disponible</h2>

          <ul className={styles.serviceList}>
            {availableStaff.map((person) => (
              <li key={person.id} className={styles.serviceCard}>
                <strong>{person.name}</strong>
              </li>
            ))}
          </ul>

          {availableStaff.length === 0 && (
            <p>No hay staff disponible para este servicio.</p>
          )}

          <Link href="/booking">Volver a los servicios</Link>
        </section>
      </main>
    </div>
  );
}