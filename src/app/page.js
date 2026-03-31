import DashboardClient from "./components/dashboard-client";
import styles from "./page.module.css";
import { getQuizImages, getScoreImages, getVideoAssets } from "@/lib/quiz-images";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [quizImages, scoreImages, videoAssets] = await Promise.all([
    getQuizImages(),
    getScoreImages(),
    getVideoAssets(),
  ]);
  const scoreOverlayConfigByImage = {
    "/IT samples score/Score board team 01.jpg": {
      mode: "single",
      overlayPath: "/IT score html/score-200.html",
      overlayLayer: 11,
      overlayDelayMs: 50,
      inputs: [{ key: "value", label: "Score" }],
    },
    "/IT samples score/Score board team 02.jpg": {
      mode: "single",
      overlayPath: "/IT score html/score-200.html",
      overlayLayer: 11,
      overlayDelayMs: 50,
      inputs: [{ key: "value", label: "Score" }],
    },
    "/IT samples score/Score board team 03.jpg": {
      mode: "single",
      overlayPath: "/IT score html/score-200.html",
      overlayLayer: 11,
      overlayDelayMs: 50,
      inputs: [{ key: "value", label: "Score" }],
    },
    "/IT samples score/Score board team 04.jpg": {
      mode: "single",
      overlayPath: "/IT score html/score-200.html",
      overlayLayer: 11,
      overlayDelayMs: 50,
      inputs: [{ key: "value", label: "Score" }],
    },
    "/IT samples score/Score board Total team.jpg": {
      mode: "team",
      overlayPath: "/IT score html/team-scores.html",
      overlayLayer: 11,
      overlayDelayMs: 50,
      inputs: [
        { key: "team1", label: "Team 1" },
        { key: "team2", label: "Team 2" },
        { key: "team3", label: "Team 3" },
        { key: "team4", label: "Team 4" },
      ],
    },
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <DashboardClient
          quizImages={quizImages}
          scoreImages={scoreImages}
          videoAssets={videoAssets}
          scoreOverlayConfigByImage={scoreOverlayConfigByImage}
        />
      </main>
    </div>
  );
}
