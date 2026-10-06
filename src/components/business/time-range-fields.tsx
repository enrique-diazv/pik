"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getTimeOptions,
  minutesToTime,
  timeToMinutes,
} from "@/lib/time-picker";
import type { TimeRange } from "@/types/business";
import styles from "./onboarding.module.css";

function normalizeRange(range: TimeRange, minimumOpening: number): TimeRange {
  if (minimumOpening > 1438) {
    return range;
  }

  const opening = Math.min(
    1438,
    Math.max(minimumOpening, timeToMinutes(range.opensAt || "00:00"))
  );

  const closing = Math.min(
    1439,
    Math.max(opening, timeToMinutes(range.closesAt || "00:00"))
  );

  return {
    ...range,
    opensAt: minutesToTime(opening),
    closesAt: minutesToTime(closing),
  };
}

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
  const selectedValueRef = useRef(value);

  useEffect(() => {
    selectedValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const column = columnRef.current;
    const button = column?.querySelector<HTMLButtonElement>("button");

    if (!column || !button) {
      return;
    }

    const index = Math.max(0, options.indexOf(selectedValueRef.current));
    column.scrollTop = index * button.offsetHeight;
  }, [options]);

  function selectIndex(index: number) {
    const column = columnRef.current;
    const button = column?.querySelector<HTMLButtonElement>("button");

    if (!column || !button) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(options.length - 1, index));

    onSelect(options[nextIndex]);
    column.scrollTop = nextIndex * button.offsetHeight;
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
            options.length - 1,
            Math.round(column.scrollTop / button.offsetHeight)
          )
        );

        if (options[index] !== value) {
          onSelect(options[index]);
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
          return;
        }

        event.preventDefault();

        const currentIndex = Math.max(0, options.indexOf(value));
        const direction = event.key === "ArrowDown" ? 1 : -1;

        selectIndex(currentIndex + direction);
      }}
    >
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={styles.numberOption}
          aria-label={`${label}: ${option}`}
          aria-pressed={option === value}
          tabIndex={option === value ? 0 : -1}
          onClick={() => selectIndex(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

interface TimeRangeFieldsProps {
  idPrefix: string;
  value: TimeRange;
  previousClosesAt?: string;
  onChange: (value: TimeRange) => void;
  onPickerChange: (rangeId: string, isPicking: boolean) => void;
}

export function TimeRangeFields({
  idPrefix,
  value,
  previousClosesAt,
  onChange,
  onPickerChange,
}: TimeRangeFieldsProps) {
  const [isPicking, setIsPicking] = useState(
    () => !value.opensAt || !value.closesAt
  );

  const minimumOpening = previousClosesAt
    ? timeToMinutes(previousClosesAt)
    : 0;

  const [rawDraft, setDraft] = useState<TimeRange>(() => ({
    ...value,
    opensAt: value.opensAt || "00:00",
    closesAt: value.closesAt || "00:00",
  }));

  const draft = normalizeRange(rawDraft, minimumOpening);
  const [error, setError] = useState("");
  const openingButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPicking) {
      pickerRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    }
  }, [isPicking]);

  const [openingHour = "", openingMinute = ""] = draft.opensAt.split(":");
  const [closingHour = "", closingMinute = ""] = draft.closesAt.split(":");

  const minimumClosing = Math.max(
    minimumOpening,
    timeToMinutes(draft.opensAt || "00:00")
  );

  const openingHours = useMemo(
    () => getTimeOptions(minimumOpening, 1438, "00").hours,
    [minimumOpening]
  );

  const openingMinutes = useMemo(
    () => getTimeOptions(minimumOpening, 1438, openingHour).minutes,
    [minimumOpening, openingHour]
  );

  const closingHours = useMemo(
    () => getTimeOptions(minimumClosing, 1439, "00").hours,
    [minimumClosing]
  );

  const closingMinutes = useMemo(
    () => getTimeOptions(minimumClosing, 1439, closingHour).minutes,
    [minimumClosing, closingHour]
  );

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
      const normalized = normalizeRange(current, minimumOpening);
      const [hour, minute] = normalized[field].split(":");

      const updated = {
        ...normalized,
        [field]:
          part === "hour"
            ? `${selectedValue}:${minute}`
            : `${hour}:${selectedValue}`,
      };

      return normalizeRange(updated, minimumOpening);
    });
  }

  function startPicking() {
    setDraft({
      ...value,
      opensAt: value.opensAt || "00:00",
      closesAt: value.closesAt || "00:00",
    });
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

    if (
      previousClosesAt &&
      timeToMinutes(draft.opensAt) <= timeToMinutes(previousClosesAt)
    ) {
      setError(
        `La apertura debe ser posterior al cierre anterior: ${previousClosesAt}.`
      );
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
        <div
          ref={pickerRef}
          id={`${idPrefix}-picker`}
          className={styles.rangePicker}
        >
          <div className={styles.pickerTimes}>
            <div>
              <p className={styles.pickerLabel}>Apertura</p>

              <div className={styles.timeColumns}>
                <NumberColumn
                  label="Hora de apertura"
                  options={openingHours}
                  value={openingHour}
                  onSelect={(hour) =>
                    updateTimePart("opensAt", "hour", hour)
                  }
                />

                <NumberColumn
                  label="Minuto de apertura"
                  options={openingMinutes}
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
                  options={closingHours}
                  value={closingHour}
                  onSelect={(hour) =>
                    updateTimePart("closesAt", "hour", hour)
                  }
                />

                <NumberColumn
                  label="Minuto de cierre"
                  options={closingMinutes}
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