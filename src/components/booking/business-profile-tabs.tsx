"use client";
import Image from "next/image";
import { useState } from "react";
import type {
  BusinessImage,
  Service,
  StaffMember,
  OpeningHours,
} from "@/types/business";
import {
  IconlyBag2,
  IconlyImage,
  IconlyTimeCircle,
} from "./booking-icons";
import styles from "./business-profile-tabs.module.css";
import { BusinessGallery } from "./business-gallery";
import { BottomSheet } from "./bottom-sheet";
import { BookingDatePicker } from "./booking-date-picker";
import type {
  BookingReservation,
  BookingSlot,
} from "@/types/booking";
import { BookingTimePicker } from "./booking-time-picker";
import { confirmBookingMock } from "@/data/mocks/booking-reservations";


interface BusinessProfileTabsProps {
  services: Service[];
  staff: StaffMember[];
  openingHours: OpeningHours[];
  gallery?: BusinessImage[];
}

export function BusinessProfileTabs({
  services,
  staff,
  openingHours,
  gallery = [],
}: BusinessProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"services" | "gallery">(
    "services"
  );

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [bookingStep, setBookingStep] = useState<
    "staff" | "datetime" | "summary"
  >("staff");

  const availableStaff = selectedService
    ? staff.filter((person) =>
      person.serviceIds.includes(selectedService.id)
    )
    : [];
  const staffOptions = availableStaff.length > 0
    ? [
      {
        id: "cualquiera",
        name: "Cualquier persona disponible",
      },
      ...availableStaff.map((person) => ({
        id: person.id,
        name: person.name,
      })),
    ]
    : [];

  const selectedStaff = staffOptions.find(
    (person) => person.id === selectedStaffId
  );

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);

  const canContinueBooking =
    selectedDate !== "" &&
    selectedSlot !== null &&
    selectedSlot.availableStaffIds.length > 0;

  const [isSaving, setIsSaving] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedReservation, setConfirmedReservation] =
    useState<BookingReservation | null>(null);

  function startBooking(service: Service) {
    setSelectedService(service);
    setSelectedStaffId("");
    setBookingStep("staff");
    setSelectedDate("");
    setSelectedSlot(null);
    setBookingError("");
    setConfirmedReservation(null);
  }

  async function handleConfirmBooking() {
    if (
      isSaving ||
      confirmedReservation ||
      !selectedService ||
      !selectedStaff ||
      !selectedSlot ||
      !selectedDate
    ) {
      return;
    }

    setIsSaving(true);
    setBookingError("");

    try {
      const reservation = await confirmBookingMock({
        date: selectedDate,
        startsAt: selectedSlot.startsAt,
        service: selectedService,
        staff,
        staffId: selectedStaffId,
        openingHours,
      });

      setConfirmedReservation(reservation);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "No pudimos confirmar la reserva. Inténtalo nuevamente."
      );
      setSelectedSlot(null);
      setBookingStep("datetime");
    } finally {
      setIsSaving(false);
    }
  }

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

                  <button
                    type="button"
                    onClick={() => startBooking(service)}
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
                  </button>
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
      {selectedService && (
        <BottomSheet
          dismissible={!isSaving}
          title={
            bookingStep === "staff"
              ? "Selección de staff"
              : bookingStep === "datetime"
                ? "Selección de Horario"
                : "Resumen de tu reserva"
          }
          onClose={() => setSelectedService(null)}
          footer={
            bookingStep === "staff" ? (
              <button
                type="button"
                className={styles.confirmStaff}
                disabled={!selectedStaff}
                onClick={() => {
                  if (selectedStaff) {
                    setSelectedDate("");
                    setSelectedSlot(null);
                    setBookingStep("datetime");
                  }
                }}
              >
                Siguiente
                <span aria-hidden="true">›</span>
              </button>
            ) : (
              <div className={styles.bookingNavigation}>
                <button
                  type="button"
                  className={styles.bookingBack}
                  disabled={isSaving}
                  hidden={confirmedReservation !== null}
                  onClick={() =>
                    setBookingStep(
                      bookingStep === "datetime" ? "staff" : "datetime"
                    )
                  }
                >
                  Atrás
                </button>

                {bookingStep === "datetime" && (
                  <button
                    type="button"
                    className={styles.confirmStaff}
                    disabled={!canContinueBooking}
                    onClick={() => {
                      if (canContinueBooking) {
                        setBookingStep("summary");
                      }
                    }}
                  >
                    Siguiente
                  </button>
                )}
                {bookingStep === "summary" && (
                  <button
                    type="button"
                    className={styles.confirmStaff}
                    disabled={isSaving}
                    onClick={() => {
                      if (confirmedReservation) {
                        setSelectedService(null);
                      } else {
                        void handleConfirmBooking();
                      }
                    }}
                  >
                    {isSaving
                      ? "Confirmando…"
                      : confirmedReservation
                        ? "Terminar"
                        : "Confirmar reserva"}
                  </button>
                )}
              </div>
            )
          }
        >
          {bookingStep === "staff" ? (
            <fieldset className={styles.staffFieldset}>
              <legend className={styles.staffLegend}>
                ¿Quién realizará {selectedService.name}?
              </legend>

              <div className={styles.staffOptions}>
                {staffOptions.map((person) => (
                  <label key={person.id} className={styles.staffOption}>
                    <input
                      type="radio"
                      name="booking-staff"
                      value={person.id}
                      checked={selectedStaffId === person.id}
                      onChange={() => setSelectedStaffId(person.id)}
                    />
                    <span>{person.name}</span>
                  </label>
                ))}
              </div>

              {availableStaff.length === 0 && (
                <p>No hay staff disponible para este servicio.</p>
              )}
            </fieldset>
          ) : (
            <>
              <div hidden={bookingStep !== "datetime"}>
                <BookingDatePicker
                  service={selectedService}
                  staff={staff}
                  staffId={selectedStaffId}
                  openingHours={openingHours}
                  value={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                />

                <BookingTimePicker
                  date={selectedDate}
                  service={selectedService}
                  staff={staff}
                  staffId={selectedStaffId}
                  openingHours={openingHours}
                  value={selectedSlot}
                  onChange={setSelectedSlot}
                />
              </div>

              {bookingStep === "summary" && selectedSlot && !confirmedReservation && (
                <dl className={styles.bookingSummary}>
                  <dt>Servicio</dt>
                  <dd>{selectedService.name}</dd>

                  <dt>Staff</dt>
                  <dd>{selectedStaff?.name}</dd>

                  <dt>Fecha</dt>
                  <dd>{selectedDate.split("-").reverse().join("/")}</dd>

                  <dt>Horario</dt>
                  <dd>
                    {selectedSlot.startsAt} – {selectedSlot.endsAt}
                  </dd>

                  <dt>Total</dt>
                  <dd>
                    ${selectedService.priceMxn.toLocaleString("es-MX")} MXN
                  </dd>
                </dl>
              )}
            </>
          )}
          {bookingError && (
            <p role="alert" className={styles.bookingError}>
              {bookingError}
            </p>
          )}

          {confirmedReservation && (
            <div role="status" className={styles.bookingSuccess}>
              <h3>Reserva confirmada</h3>

              <p>{selectedService.name}</p>

              <p>
                Con{" "}
                {staff.find(
                  (person) => person.id === confirmedReservation.staffId
                )?.name}
              </p>

              <p>
                {confirmedReservation.date.split("-").reverse().join("/")}
                {" · "}
                {confirmedReservation.startsAt} – {confirmedReservation.endsAt}
              </p>

              <p>Folio: {confirmedReservation.id}</p>
            </div>
          )}
        </BottomSheet>
      )}
    </section>
  );
}