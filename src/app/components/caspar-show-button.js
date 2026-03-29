'use client'

import styles from "../page.module.css";

export default function CasparShowButton({
  imagePath,
  isActive,
  isPending,
  message,
  onPlay,
  scoreInputs,
  onScoreChange,
}) {
  return (
    <div className={styles.buttonGroup}>
      {Array.isArray(scoreInputs) && scoreInputs.length > 0 ? (
        <div className={styles.scoreInputsGroup}>
          {scoreInputs.map((input) => (
            <label key={input.key} className={styles.scoreInputLabel}>
              <span>{input.label}</span>
              <input
                type="text"
                className={styles.scoreInput}
                value={input.value}
                onChange={(event) =>
                  onScoreChange?.(imagePath, input.key, event.target.value)
                }
              />
            </label>
          ))}
        </div>
      ) : null}
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
