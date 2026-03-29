'use client'

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CasparShowButton from "./caspar-show-button";
import styles from "../page.module.css";

export default function GalleryClient({ title, images, refreshLabel }) {
  const router = useRouter();
  const [activeImagePath, setActiveImagePath] = useState(null);
  const [statusImagePath, setStatusImagePath] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefreshTransition] = useTransition();

  function handleRefresh() {
    startRefreshTransition(() => {
      setActiveImagePath(null);
      setStatusImagePath(null);
      setStatusMessage("");
      router.refresh();
    });
  }

  function handlePlay(imagePath) {
    startTransition(async () => {
      setStatusImagePath(imagePath);
      setStatusMessage("");

      try {
        const response = await fetch("/api/casparcg/play", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagePath,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to play image in CasparCG.");
        }

        setActiveImagePath(imagePath);
        setStatusMessage("Playing in CasparCG");
      } catch (error) {
        setStatusMessage(error.message);
      }
    });
  }

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryHeader}>
        <h1 className={styles.galleryHeading}>{title}</h1>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : refreshLabel}
        </button>
      </div>
      <div className={styles.gallery}>
        {images.map((image, index) => {
          const filename = image.split("/").pop();

          return (
            <div key={image} className={styles.imageContainer}>
              <h3 className={styles.imageTitle}>{filename}</h3>
              <div className={styles.imageRow}>
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={400}
                  height={300}
                  priority={index < 3}
                />
                <CasparShowButton
                  imagePath={image}
                  isActive={activeImagePath === image}
                  isPending={isPending && statusImagePath === image}
                  message={statusImagePath === image ? statusMessage : ""}
                  onPlay={handlePlay}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
