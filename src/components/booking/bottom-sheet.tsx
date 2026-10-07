"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import styles from "./bottom-sheet.module.css";

interface BottomSheetProps {
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    onClose: () => void;
    dismissible?: boolean;
}

export function BottomSheet({
    title,
    children,
    footer,
    onClose,
    dismissible = true,
}: BottomSheetProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (!dialog.open) {
            dialog.showModal();
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
            dialog.close();
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className={styles.sheet}
            aria-labelledby={titleId}
            onClose={onClose}
            onCancel={(event) => {
                if (!dismissible) {
                    event.preventDefault();
                }
            }}
            onClick={(event) => {
                if (dismissible && event.target === event.currentTarget) {
                    dialogRef.current?.close();
                }
            }}
        >
            <header className={styles.header}>
                <span className={styles.handle} aria-hidden="true" />
                <h2 id={titleId}>{title}</h2>
            </header>

            <div className={styles.content}>{children}</div>

            {footer && <footer className={styles.footer}>{footer}</footer>}
        </dialog>
    );
}