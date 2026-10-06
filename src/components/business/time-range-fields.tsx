"use client";

import { useEffect, useRef, useState } from "react";
import type { TimeRange } from "@/types/business";
import styles from "./onboarding.module.css";

const hours = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
);

const minutes = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

interface NumberColumnProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

function NumberColumn({
  label,
  options,
  value,
  onSelect,
}: NumberColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef(value);

  useEffect(() => {
    const column = columnRef.current;
    const button = column?.querySelector<HTMLButtonElement>("button");

    if (!column || !button) {
      return;
    }

    const index = options.indexOf(initialValueRef.current) + 1;
    column.scrollTop = index * button.offsetHeight;
  }, [options]);

  function selectIndex(index: number) {
    const column = columnRef.current;
    const button = column?.querySelector<HTMLButtonElement>("button");

    if (!column || !button) {
      return;
    }

    const nextValue = index === 0 ? "" : options[index - 1];

    onSelect(nextValue);
    column.scrollTop = index * button.offsetHeight;
  }

  return (
    <div
      ref={columnRef}
      className={styles.numberColumn}
      role="group"
      aria-label={label}
      onScroll={(event) => {
        const column = event.currentTarget;
        const button = column.querySelector<HTMLButtonElement>("button");

        if (!button) {
          return;
        }

        const index = Math.max(
          0,
          Math.min(
            options.length,
            Math.round(column.scrollTop / button.offsetHeight)
          )
        );

        const nextValue = index === 0 ? "" : options[index - 1];

        if (nextValue !== value) {
          onSelect(nextValue);
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
          return;
        }

        event.preventDefault();

        const column = event.currentTarget;
        const button = column.querySelector<HTMLButtonElement>("button");

        if (!button) {
          return;
        }

        const currentIndex = Math.round(
          column.scrollTop / button.offsetHeight
        );

        const direction = event.key === "ArrowDown" ? 1 : -1;

        selectIndex(
          Math.max(0, Math.min(options.length, currentIndex + direction))
        );
      }}
    >
      {["", ...options].map((option, index) => (
        <button
          key={option || "empty"}
          type="button"
          className={styles.numberOption}
          aria-label={`${label}: ${option || "sin seleccionar"}`}
          aria-pressed={option === value}
          tabIndex={option === value ? 0 : -1}
          onClick={() => selectIndex(index)}
        >
          {option || "—"}
        </button>
      ))}
    </div>
  );
}

interface TimeRangeFieldsProps {
  idPrefix: string;
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  onPickerChange: (rangeId: string, isPicking: boolean) => void;
}

export function TimeRangeFields({
  idPrefix,
  value,
  onChange,
  onPickerChange,
}: TimeRangeFieldsProps) {
  const [isPicking, setIsPicking] = useState(
    () => !value.opensAt || !value.closesAt
  );
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const openingButtonRef = useRef<HTMLButtonElement>(null);

  const [openingHour = "", openingMinute = ""] = draft.opensAt.split(":");
  const [closingHour = "", closingMinute = ""] = draft.closesAt.split(":");

  useEffect(() => {
    onPickerChange(idPrefix, isPicking);

    return () => {
      onPickerChange(idPrefix, false);
    };
  }, [idPrefix, isPicking, onPickerChange]);

  function updateTimePart(
    field: "opensAt" | "closesAt",
    part: "hour" | "minute",
    selectedValue: string
  ) {
    setDraft((current) => {
      const [hour = "", minute = ""] = current[field].split(":");

      return {
        ...current,
        [field]:
          part === "hour"
            ? `${selectedValue}:${minute}`
            : `${hour}:${selectedValue}`,
      };
    });
  }

  function startPicking() {
    setDraft(value);
    setError("");
    setIsPicking(true);
  }

  function confirmRange() {
    const timePattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

    if (
      !timePattern.test(draft.opensAt) ||
      !timePattern.test(draft.closesAt)
    ) {
      setError("Selecciona la hora y los minutos de apertura y cierre.");
      return;
    }

    if (draft.opensAt >= draft.closesAt) {
      setError("El cierre debe ser posterior a la apertura.");
      return;
    }

    onChange(draft);
    setError("");
    setIsPicking(false);
    openingButtonRef.current?.focus();
  }

  return (
    <div className={styles.rangeEditor}>
      <div className={styles.rangeButtons} hidden={isPicking}>
        <button
          ref={openingButtonRef}
          type="button"
          className={styles.timeButton}
          aria-label={`Editar apertura: ${value.opensAt}`}
          aria-expanded={isPicking}
          aria-controls={`${idPrefix}-picker`}
          onClick={startPicking}
        >
          {value.opensAt}
        </button>

        <span className={styles.rangeSeparator}>a</span>

        <button
          type="button"
          className={styles.timeButton}
          aria-label={`Editar cierre: ${value.closesAt}`}
          aria-expanded={isPicking}
          aria-controls={`${idPrefix}-picker`}
          onClick={startPicking}
        >
          {value.closesAt}
        </button>
      </div>

      {isPicking && (
        <div id={`${idPrefix}-picker`} className={styles.rangePicker}>
          <div className={styles.pickerTimes}>
            <div>
              <p className={styles.pickerLabel}>Apertura</p>

              <div className={styles.timeColumns}>
                <NumberColumn
                  label="Hora de apertura"
                  options={hours}
                  value={openingHour}
                  onSelect={(hour) =>
                    updateTimePart("opensAt", "hour", hour)
                  }
                />

                <NumberColumn
                  label="Minuto de apertura"
                  options={minutes}
                  value={openingMinute}
                  onSelect={(minute) =>
                    updateTimePart("opensAt", "minute", minute)
                  }
                />
              </div>
            </div>

            <div>
              <p className={styles.pickerLabel}>Cierre</p>

              <div className={styles.timeColumns}>
                <NumberColumn
                  label="Hora de cierre"
                  options={hours}
                  value={closingHour}
                  onSelect={(hour) =>
                    updateTimePart("closesAt", "hour", hour)
                  }
                />

                <NumberColumn
                  label="Minuto de cierre"
                  options={minutes}
                  value={closingMinute}
                  onSelect={(minute) =>
                    updateTimePart("closesAt", "minute", minute)
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.confirmTimeButton}
            aria-label="Confirmar horario"
            onClick={confirmRange}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 25 25"
              fill="none"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0905 10.0968C16.3834 10.3897 16.3834 10.8645 16.0905 11.1574L11.3445 15.9034C11.0517 16.1963 10.5769 16.1963 10.284 15.9035L7.90997 13.5305C7.61701 13.2377 7.61691 12.7628 7.90974 12.4699C8.20258 12.1769 8.67745 12.1768 8.9704 12.4697L10.8141 14.3126L15.0299 10.0968C15.3227 9.80388 15.7976 9.80388 16.0905 10.0968Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.24305 5.24339C5.91083 3.57561 8.48966 3.00009 11.9998 3.00009C15.5099 3.00009 18.0887 3.57561 19.7565 5.24339C21.4242 6.91116 21.9998 9.48999 21.9998 13.0001C21.9998 16.5102 21.4242 19.089 19.7565 20.7568C18.0887 22.4246 15.5099 23.0001 11.9998 23.0001C8.48966 23.0001 5.91083 22.4246 4.24305 20.7568C2.57527 19.089 1.99976 16.5102 1.99976 13.0001C1.99976 9.48999 2.57527 6.91116 4.24305 5.24339ZM5.30371 6.30405C4.08074 7.52702 3.49976 9.57319 3.49976 13.0001C3.49976 16.427 4.08074 18.4732 5.30371 19.6961C6.52668 20.9191 8.57285 21.5001 11.9998 21.5001C15.4267 21.5001 17.4728 20.9191 18.6958 19.6961C19.9188 18.4732 20.4998 16.427 20.4998 13.0001C20.4998 9.57319 19.9188 7.52702 18.6958 6.30405C17.4728 5.08107 15.4267 4.50009 11.9998 4.50009C8.57285 4.50009 6.52668 5.08107 5.30371 6.30405Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}