'use client'

import { useState, useTransition } from "react";
import styles from "../page.module.css";

export default function GlobalStopButton({ layers, onStopped }) {
  const [message, setMessage] = useState("");
  const [isStopping, startTransition] = useTransition();

  function handleStop() {
    startTransition(async () => {
      setMessage("");

      try {
        const response = await fetch("/api/casparcg/stop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ layers }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to stop CasparCG layers.");
        }

        onStopped?.();
        setMessage("Layers stopped");
      } catch (error) {
        setMessage(error.message);
      }
    });
  }

  return (
    <div className={styles.topBar}>
      <button
        type="button"
        className={styles.stopButton}
        onClick={handleStop}
        disabled={isStopping}
      >
        {isStopping ? "Stopping..." : "Stop"}
      </button>
      {message ? <p className={styles.topBarMessage}>{message}</p> : null}
    </div>
  );
}
