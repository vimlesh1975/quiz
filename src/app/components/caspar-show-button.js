'use client'

import styles from "../page.module.css";

export default function CasparShowButton({
  imagePath,
  isActive,
  isPending,
  message,
  onPlay,
}) {
  return (
    <div className={styles.buttonGroup}>
      <button
        type="button"
        className={`${styles.showButton} ${isActive ? styles.showButtonActive : ""}`}
        onClick={() => onPlay(imagePath)}
        disabled={isPending}
      >
        {isPending ? "Sending..." : isActive ? "Playing" : "Show"}
      </button>
      {message ? <p className={styles.buttonMessage}>{message}</p> : null}
    </div>
  );
}
