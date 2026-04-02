'use client'

import { useState } from "react";
import GalleryClient from "./gallery-client";
import GlobalStopButton from "./global-stop-button";
import styles from "../page.module.css";

export default function DashboardClient({
  quizImages,
  scoreImages,
  videoAssets,
  scoreOverlayConfigByImage,
}) {
  const [activeImagePath, setActiveImagePath] = useState(null);

  return (
    <>
      <GlobalStopButton
        layers={[10, 11]}
        onStopped={() => setActiveImagePath(null)}
      />
      <div className={styles.galleryColumns}>
        <div className={styles.scrollColumn}>
          <GalleryClient
            title="Gallery - All Images"
            images={quizImages}
            activeImagePath={activeImagePath}
            onActiveImageChange={setActiveImagePath}
            stopLayersOnPlay={[11]}
          />
        </div>
        <div className={styles.scrollColumn}>
          <GalleryClient
            title="Score - All Images"
            images={scoreImages}
            overlayConfigByImage={scoreOverlayConfigByImage}
            activeImagePath={activeImagePath}
            onActiveImageChange={setActiveImagePath}
          />
        </div>
        <div className={styles.scrollColumn}>
          <GalleryClient
            title="Video - All Files"
            images={videoAssets}
            activeImagePath={activeImagePath}
            onActiveImageChange={setActiveImagePath}
            stopLayersOnPlay={[11]}
            showLoopToggle
            showChannel2Toggle
          />
        </div>
      </div>
    </>
  );
}
