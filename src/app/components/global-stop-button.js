'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function GlobalStopButton({ layers, onStopped }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isStopping, startTransition] = useTransition();
  const [isRefreshing, startRefreshTransition] = useTransition();

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

  function handleRefresh() {
    startRefreshTransition(() => {
      setMessage("");
      router.refresh();
    });
  }

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarSide}>
        {message ? <p className={styles.topBarMessage}>{message}</p> : null}
      </div>
      <h1 className={styles.topBarTitle}>DD Chennai Quiz Graphics</h1>
      <div className={styles.topBarSideRight}>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
        <button
          type="button"
          className={styles.stopButton}
          onClick={handleStop}
          disabled={isStopping}
        >
          {isStopping ? "Stopping..." : "Stop"}
        </button>
      </div>
    </div>
  );
}
