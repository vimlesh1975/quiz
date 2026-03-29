'use client'

import { useState, useTransition } from "react";
import styles from "../page.module.css";

export default function CasparShowButton({ imagePath }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      setMessage("");

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

        setMessage("Playing in CasparCG");
      } catch (error) {
        setMessage(error.message);
      }
    });
  }

  return (
    <div className={styles.buttonGroup}>
      <button
        type="button"
        className={styles.showButton}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Show"}
      </button>
      {message ? <p className={styles.buttonMessage}>{message}</p> : null}
    </div>
  );
}
