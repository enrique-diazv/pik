"use client";
import Image from "next/image";
import { useState } from "react";
import type { BusinessImage, Service } from "@/types/business";
import {
  IconlyBag2,
  IconlyImage,
  IconlyTimeCircle,
} from "./booking-icons";
import styles from "./business-profile-tabs.module.css";
import Link from "next/link";
import { BusinessGallery } from "./business-gallery";

interface BusinessProfileTabsProps {
  services: Service[];
  gallery?: BusinessImage[];
}

export function BusinessProfileTabs({
  services,
  gallery = [],
}: BusinessProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"services" | "gallery">(
    "services"
  );

  return (
    <section aria-label="Servicios y galería">
      <div className={styles.tabs} aria-label="Ver contenido del negocio">
        <button
          type="button"
          className={styles.tab}
          aria-pressed={activeTab === "services"}
          onClick={() => setActiveTab("services")}
        >
          <IconlyBag2 />
          Servicios
        </button>

        <button
          type="button"
          className={styles.tab}
          aria-pressed={activeTab === "gallery"}
          onClick={() => setActiveTab("gallery")}
        >
          <IconlyImage />
          Galería
        </button>
      </div>

      {activeTab === "services" ? (
        <ul className={styles.services} aria-label="Servicios disponibles">
          {services.map((service) => (
            <li key={service.id} className={styles.service}>
              <div className={styles.imageContainer}>
                {service.image && (
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(max-width: 360px) 80px, 88px"
                    className={styles.serviceImage}
                  />
                )}
              </div>

              <div className={styles.serviceContent}>
                <h2>{service.name}</h2>

                {service.description && <p>{service.description}</p>}

                <div className={styles.serviceFooter}>
                  <div className={styles.details}>
                    <span className={styles.duration}>
                      <span className={styles.clock}>
                        <IconlyTimeCircle size={20} />
                      </span>
                      {service.durationMinutes} min
                    </span>

                    <span className={styles.price}>
                      ${service.priceMxn.toLocaleString("es-MX")}{" "}
                      <small>MXN</small>
                    </span>
                  </div>

                  <Link
                    href={`/booking/${encodeURIComponent(service.id)}`}
                    className={styles.bookButton}
                    aria-label={`Agendar ${service.name}`}
                  >
                    Agendar
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m9 5 7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </li>
          ))}

          {services.length === 0 && (
            <li className={styles.empty}>
              No hay servicios disponibles por el momento.
            </li>
          )}
        </ul>
      ) : gallery.length > 0 ? (
        <BusinessGallery photos={gallery} />
      ) : (
        <p className={styles.empty}>
          Este negocio todavía no tiene fotos en su galería.
        </p>
      )}
    </section>
  );
}