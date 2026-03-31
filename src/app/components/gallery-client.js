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
  overlayConfigByImage,
  activeImagePath,
  onActiveImageChange,
  stopLayersOnPlay,
}) {
  const router = useRouter();
  const [statusImagePath, setStatusImagePath] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [scoreValues, setScoreValues] = useState(() =>
    createScoreValues(images, overlayConfigByImage)
  );

  function createRandomScore() {
    return String(180 + Math.floor(Math.random() * 41));
  }

  function createScoreValues(nextImages, nextOverlayConfigByImage) {
    return Object.fromEntries(
      nextImages.map((image) => {
        const overlayConfig = nextOverlayConfigByImage?.[image];

        if (!overlayConfig?.inputs?.length) {
          return [image, {}];
        }

        return [
          image,
          Object.fromEntries(
            overlayConfig.inputs.map((input) => [input.key, createRandomScore()])
          ),
        ];
      })
    );
  }

  function handleRefresh() {
    startRefreshTransition(() => {
      setStatusImagePath(null);
      setStatusMessage("");
      setScoreValues(createScoreValues(images, overlayConfigByImage));
      router.refresh();
    });
  }

  function handleScoreChange(imagePath, inputKey, value) {
    setScoreValues((currentValues) => ({
      ...currentValues,
      [imagePath]: {
        ...currentValues[imagePath],
        [inputKey]: value,
      },
    }));
  }

  function handlePlay(imagePath) {
    startTransition(async () => {
      setStatusImagePath(imagePath);
      setStatusMessage("");

      const overlayConfig = overlayConfigByImage?.[imagePath];
      const overlayValues = scoreValues[imagePath] || {};

      try {
        const response = await fetch("/api/casparcg/play", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagePath,
            stopLayers: stopLayersOnPlay,
            overlayPath: overlayConfig?.overlayPath,
            overlayLayer: overlayConfig?.overlayLayer,
            overlayValue: overlayConfig?.mode === "single" ? overlayValues.value ?? "" : undefined,
            overlayValues: overlayConfig?.mode === "team" ? overlayValues : undefined,
            overlayType: overlayConfig?.mode,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to play image in CasparCG.");
        }

        onActiveImageChange?.(imagePath);
        setStatusMessage("Playing in CasparCG");
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

    if (
      image.endsWith(".mp4") ||
      image.endsWith(".mov") ||
      image.endsWith(".webm")
    ) {
      return (
        <video
          className={styles.videoPreview}
          src={image}
          muted
          playsInline
          preload="metadata"
        />
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
              </div>
              <div className={styles.imageRow}>
                {renderAssetPreview(image, index, filename)}
                <CasparShowButton
                  imagePath={image}
                  isActive={activeImagePath === image}
                  isPending={isPending && statusImagePath === image}
                  message={statusImagePath === image ? statusMessage : ""}
                  onPlay={handlePlay}
                  scoreInputs={overlayConfigByImage?.[image]?.inputs?.map((input) => ({
                    ...input,
                    value: scoreValues[image]?.[input.key] ?? "",
                  }))}
                  onScoreChange={handleScoreChange}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
