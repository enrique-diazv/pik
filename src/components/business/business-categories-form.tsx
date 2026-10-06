"use client";

import { useState, type FormEvent } from "react";
import type { BusinessCategory } from "@/types/business";
import styles from "./onboarding.module.css";

interface CategoryOption {
    value: BusinessCategory;
    label: string;
}

const categoryOptions: CategoryOption[] = [
    { value: "salon", label: "Salón" },
    { value: "barbershop", label: "Barbería" },
    { value: "spa", label: "Spa" },
    { value: "nails", label: "Estudio de uñas" },
    { value: "massage", label: "Masaje" },
    { value: "podiatry", label: "Podología" },
    { value: "physiotherapy", label: "Fisioterapia" },
];

interface BusinessCategoriesFormProps {
    values: BusinessCategory[];
    onChange: (values: BusinessCategory[]) => void;
    onBack: () => void;
    onContinue: () => void;
}

export function BusinessCategoriesForm({
    values,
    onChange,
    onBack,
    onContinue,
}: BusinessCategoriesFormProps) {
    const [error, setError] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    function toggleCategory(category: BusinessCategory) {
        const nextValues = values.includes(category)
            ? values.filter((value) => value !== category)
            : [...values, category];

        onChange(nextValues);
        setError("");
        setConfirmed(false);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (values.length === 0) {
            setError("Selecciona al menos una categoría.");
            setConfirmed(false);
            return;
        }

        setError("");
        setConfirmed(true);
        onContinue();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <fieldset
                className={styles.categoryFieldset}
                aria-describedby={error ? "categories-error" : undefined}
            >
                <legend>Puedes seleccionar varias</legend>

                <div className={styles.categoryList}>
                    {categoryOptions.map((category) => (
                        <label
                            key={category.value}
                            className={styles.categoryOption}
                        >
                            <input
                                type="checkbox"
                                name="categories"
                                value={category.value}
                                checked={values.includes(category.value)}
                                onChange={() => toggleCategory(category.value)}
                            />
                            <span>{category.label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {error && (
                <p id="categories-error" className={styles.error} role="alert">
                    {error}
                </p>
            )}

            {confirmed && (
                <p className={styles.success} role="status">
                    Categorías listas para continuar.
                </p>
            )}

            <footer className={styles.footer}>
                <div
                    className={`${styles.footerContent} ${styles.footerWithBack}`}
                >
                    <button
                        className={styles.backButton}
                        type="button"
                        onClick={onBack}
                    >
                        Atrás
                    </button>

                    <button
                        className={styles.nextButton}
                        type="submit"
                        disabled={values.length === 0}
                    >
                        Siguiente
                    </button>
                </div>
            </footer>
        </form>
    );
}