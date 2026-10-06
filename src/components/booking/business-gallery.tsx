"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BusinessImage } from "@/types/business";
import styles from "./business-profile-tabs.module.css";

interface BusinessGalleryProps {
  photos: BusinessImage[];
}

export function BusinessGallery({ photos }: BusinessGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<BusinessImage | null>(
    null
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!selectedPhoto || !dialog) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);

  return (
    <>
      <ul className={styles.gallery} aria-label="Fotos del negocio">
        {photos.map((photo) => (
          <li key={photo.src} className={styles.galleryItem}>
            <button
              type="button"
              className={styles.galleryButton}
              aria-label={`Ampliar: ${photo.alt}`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 504px) calc((100vw - 36px) / 2), 234px"
                className={styles.galleryImage}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.photoDialog}
        aria-label="Foto ampliada"
        onClose={() => setSelectedPhoto(null)}
        onClick={(event) => {
          const dialog = event.currentTarget;
          const image = dialog.querySelector("img");

          if (!image || !image.naturalWidth) {
            dialog.close();
            return;
          }

          const rect = image.getBoundingClientRect();
          const scale = Math.min(
            rect.width / image.naturalWidth,
            rect.height / image.naturalHeight
          );

          const visibleWidth = image.naturalWidth * scale;
          const visibleHeight = image.naturalHeight * scale;

          const left = rect.left + (rect.width - visibleWidth) / 2;
          const top = rect.top + (rect.height - visibleHeight) / 2;

          const isOutside =
            event.clientX < left ||
            event.clientX > left + visibleWidth ||
            event.clientY < top ||
            event.clientY > top + visibleHeight;

          if (isOutside) {
            dialog.close();
          }
        }}
      >
        <div className={styles.photoViewer}>

          <div className={styles.expandedPhoto}>
            {selectedPhoto && (
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                sizes="(max-width: 932px) calc(100vw - 32px), 900px"
                className={styles.expandedPhotoImage}
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}