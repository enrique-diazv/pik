import type { Metadata } from "next";
import Image from "next/image";
import { mockBusiness } from "@/data/mocks/business";
import { BusinessProfileTabs } from "@/components/booking/business-profile-tabs";
import styles from "@/components/business/onboarding.module.css";
import profileStyles from "@/components/booking/booking.module.css";
import {
  IconlyLocation,
  IconlyCall,
} from "@/components/booking/booking-icons";
import { FavoriteButton } from "@/components/booking/favorite-button";

export const metadata: Metadata = {
  title: "Reserva tu cita | PIK",
};

export default function BookingPage() {
  return (
    <div className={profileStyles.page}>
      <main className={styles.main}>
        <header className={profileStyles.header}>
          <div className={profileStyles.nameRow}>
            <h1 className={profileStyles.name}>{mockBusiness.name}</h1>
            <FavoriteButton />
          </div>

          <p className={profileStyles.contact}>
            <span className={profileStyles.contactIcon}>
              <IconlyLocation />
            </span>
            <span>{mockBusiness.address}</span>
          </p>

          <p className={profileStyles.contact}>
            <span className={profileStyles.contactIcon}>
              <IconlyCall />
            </span>
            <a
              className={profileStyles.phone}
              href={`tel:${mockBusiness.phone}`}
            >
              {mockBusiness.phone}
            </a>
          </p>
        </header>

        {mockBusiness.coverImage && (
          <Image
            src={mockBusiness.coverImage.src}
            alt={mockBusiness.coverImage.alt}
            width={420}
            height={280}
            sizes="(max-width: 528px) calc(100vw - 48px), 480px"
            preload
            className={profileStyles.cover}
          />
        )}

        <section
          className={profileStyles.content}
          aria-label="Información del negocio"
        >
          <BusinessProfileTabs
            services={mockBusiness.services}
            gallery={mockBusiness.gallery}
          />
        </section>
      </main>
    </div>
  );
}