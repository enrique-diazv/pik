"use client";

import type { OpeningHours, TimeRange } from "@/types/business";
import { canAddOpeningRange, weekdays } from "@/lib/opening-hours";
import styles from "./onboarding.module.css";
import { TimeRangeFields } from "./time-range-fields";
import { useRef, useState } from "react";
import {
  IconlyPlus,
  IconlyDelete,
  IconlyCloseSquare,
} from "./schedule-icons";

interface OpeningHoursEditorProps {
  values: OpeningHours[];
  onChange: (values: OpeningHours[]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onPickerChange: (rangeId: string, isPicking: boolean) => void;
  pendingRangeIds: string[];
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  return `${Number(hours)}:${minutes}`;
}

export function OpeningHoursEditor({
  values,
  onChange,
  isEditing,
  onEdit,
  onPickerChange,
  pendingRangeIds,
}: OpeningHoursEditorProps) {
  const nextRangeId = useRef(0);
  const [pickerSession, setPickerSession] = useState(0);
  const hasPendingPickers = pendingRangeIds.length > 0;
  function toggleDay(day: OpeningHours, isOpen: boolean) {
    const updatedDay: OpeningHours = {
      ...day,
      isOpen,
      ranges:
        isOpen && day.ranges.length === 0
          ? [{ opensAt: "09:00", closesAt: "18:00" }]
          : day.ranges,
    };

    onChange(
      values.map((currentDay) =>
        currentDay.weekday === day.weekday
          ? updatedDay
          : currentDay
      )
    );
  }

  function updateRange(
    day: OpeningHours,
    index: number,
    updatedRange: TimeRange
  ) {
    onChange(
      values.map((currentDay) =>
        currentDay.weekday === day.weekday
          ? {
            ...currentDay,
            ranges: currentDay.ranges.map((range, rangeIndex) =>
              rangeIndex === index ? updatedRange : range
            ),
          }
          : currentDay
      )
    );
  }

  function addRange(day: OpeningHours) {
    if (hasPendingPickers || !canAddOpeningRange(day.ranges)) {
      return;
    }

    let newId: string;

    do {
      nextRangeId.current += 1;
      newId = `extra-${day.weekday}-${nextRangeId.current}`;
    } while (day.ranges.some((range) => range.id === newId));

    const newRange: TimeRange = {
      id: newId,
      opensAt: "",
      closesAt: "",
    };

    onChange(
      values.map((currentDay) =>
        currentDay.weekday === day.weekday
          ? {
            ...currentDay,
            ranges: [...currentDay.ranges, newRange],
          }
          : currentDay
      )
    );
  }

  function removeRange(day: OpeningHours, index: number) {
    if (index === 0) {
      return;
    }

    onChange(
      values.map((currentDay) =>
        currentDay.weekday === day.weekday
          ? {
            ...currentDay,
            ranges: currentDay.ranges.filter(
              (_, rangeIndex) => rangeIndex !== index
            ),
          }
          : currentDay
      )
    );
  }

  function cancelPicking() {
    onChange(
      values.map((day) => ({
        ...day,
        ranges: day.ranges.filter(
          (range, index) =>
            index === 0 ||
            (range.opensAt !== "" && range.closesAt !== "")
        ),
      }))
    );

    setPickerSession((current) => current + 1);
  }

  return (
    <fieldset className={styles.categoryFieldset}>
      <legend className={styles.hoursLegend}>
        <span className={styles.hoursHeading}>
          <span>Horarios</span>

          {!isEditing && (
            <button
              className={styles.editHoursButton}
              type="button"
              onClick={onEdit}
            >
              Editar
            </button>
          )}
        </span>
      </legend>

      <div className={styles.hoursList}>
        {values.map((day) => {
          const label = weekdays.find(
            (item) => item.weekday === day.weekday
          )?.label;
          const canAddRange = canAddOpeningRange(day.ranges);

          return (
            <div
              key={day.weekday}
              className={`${styles.dayCard} ${isEditing ? "" : styles.daySummaryCard
                }`}
            >
              <div className={styles.daySummaryRow}>
                <label className={styles.dayToggle}>
                  <input
                    className={styles.toggleInput}
                    type="checkbox"
                    role="switch"
                    checked={day.isOpen}
                    onChange={(event) =>
                      toggleDay(day, event.currentTarget.checked)
                    }
                  />

                  <span
                    className={styles.toggleTrack}
                    aria-hidden="true"
                  />

                  <span>{label}</span>
                </label>

                {(!isEditing || !day.isOpen) && (
                  <div className={styles.hoursSummary}>
                    {day.isOpen ? (
                      day.ranges.map((range, index) => (
                        <span key={index}>
                          {formatTime(range.opensAt)}
                          {" - "}
                          {formatTime(range.closesAt)}
                        </span>
                      ))
                    ) : (
                      <span>Cerrado</span>
                    )}
                  </div>
                )}
              </div>

              {isEditing && day.isOpen && (
                <div className={styles.dayRanges}>
                  {day.ranges.map((range, index) => {
                    const rangeId = range.id ?? `day-${day.weekday}-range-${index}`;

                    return (
                      <div key={rangeId} className={styles.rangeRow}>
                        <TimeRangeFields
                          key={`${rangeId}-${pickerSession}`}
                          idPrefix={rangeId}
                          value={range}
                          previousClosesAt={
                            index > 0
                              ? day.ranges[index - 1].closesAt
                              : undefined
                          }
                          onChange={(updatedRange) =>
                            updateRange(day, index, updatedRange)
                          }
                          onPickerChange={onPickerChange}
                        />

                        {index > 0 &&
                          range.opensAt !== "" &&
                          range.closesAt !== "" && (
                            <button
                              type="button"
                              className={styles.deleteRangeButton}
                              aria-label={`Eliminar horario ${index + 1} de ${label}`}
                              onClick={() => removeRange(day, index)}
                            >
                              <IconlyDelete />
                            </button>
                          )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className={styles.addRangeButton}
                    disabled={!hasPendingPickers && !canAddRange}
                    aria-describedby={
                      !hasPendingPickers && !canAddRange
                        ? `range-limit-${day.weekday}`
                        : undefined
                    }
                    aria-label={
                      hasPendingPickers
                        ? "Cancelar edición de horarios abiertos"
                        : `Agregar horario para ${label}`
                    }
                    onClick={() => {
                      if (hasPendingPickers) {
                        cancelPicking();
                      } else {
                        addRange(day);
                      }
                    }}
                  >
                    {hasPendingPickers ? <IconlyCloseSquare /> : <IconlyPlus />}
                  </button>
                  {!hasPendingPickers && !canAddRange && (
                    <p
                      id={`range-limit-${day.weekday}`}
                      className={styles.pendingHoursMessage}
                    >
                      No queda tiempo para agregar otro horario en este día.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
