'use client'

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CasparShowButton from "./caspar-show-button";
import styles from "../page.module.css";

export default function GalleryClient({
  title,
  images,
  refreshLabel,
  overlayPath,
  overlayLayer,
  stopLayers,
}) {
  const router = useRouter();
  const [activeImagePath, setActiveImagePath] = useState(null);
  const [statusImagePath, setStatusImagePath] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isStopping, startStopTransition] = useTransition();

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
            overlayPath,
            overlayLayer,
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

  function handleStop() {
    startStopTransition(async () => {
      setStatusImagePath(null);
      setStatusMessage("");

      try {
        const response = await fetch("/api/casparcg/stop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            layers: stopLayers,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to stop CasparCG layers.");
        }

        setActiveImagePath(null);
      } catch (error) {
        setStatusMessage(error.message);
      }
    });
  }

  function renderAssetPreview(image, index, filename) {
    if (image.endsWith(".html") || image.endsWith(".htm")) {
      return (
        <div className={styles.htmlPreview} aria-label={`${filename} HTML preview`}>
          <span className={styles.htmlPreviewLabel}>HTML</span>
          <span className={styles.htmlPreviewName}>{filename}</span>
        </div>
      );
    }

    return (
      <Image
        src={image}
        alt={`Image ${index + 1}`}
        width={400}
        height={300}
        priority={index < 3}
      />
    );
  }

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryHeader}>
        <h1 className={styles.galleryHeading}>{title}</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : refreshLabel}
          </button>
        </div>
      </div>
      <div className={styles.gallery}>
        {images.map((image, index) => {
          const filename = image.split("/").pop();

          return (
            <div key={image} className={styles.imageContainer}>
              <div className={styles.imageTitleRow}>
                <h3 className={styles.imageTitle}>{filename}</h3>
                {index === 0 && stopLayers?.length ? (
                  <button
                    type="button"
                    className={styles.stopButton}
                    onClick={handleStop}
                    disabled={isStopping}
                  >
                    {isStopping ? "Stopping..." : "Stop"}
                  </button>
                ) : null}
              </div>
              <div className={styles.imageRow}>
                {renderAssetPreview(image, index, filename)}
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
