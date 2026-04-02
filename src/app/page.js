import DashboardClient from "./components/dashboard-client";
import styles from "./page.module.css";
import { getQuizImages, getScoreImages, getVideoAssets } from "@/lib/quiz-images";

export const dynamic = "force-dynamic";

function getScoreOverlayConfigByImage(scoreImages) {
  return Object.fromEntries(
    scoreImages.flatMap((imagePath) => {
      const fileName = imagePath.split("/").pop()?.toLowerCase() ?? "";

      if (fileName.includes("total")) {
        return [[
          imagePath,
          {
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
        ]];
      }

      if (fileName.includes("team")) {
        return [[
          imagePath,
          {
            mode: "single",
            overlayPath: "/IT score html/score-200.html",
            overlayLayer: 11,
            overlayDelayMs: 50,
            inputs: [{ key: "value", label: "Score" }],
          },
        ]];
      }

      return [];
    })
  );
}

export default async function Home() {
  const [quizImages, scoreImages, videoAssets] = await Promise.all([
    getQuizImages(),
    getScoreImages(),
    getVideoAssets(),
  ]);
  const scoreOverlayConfigByImage = getScoreOverlayConfigByImage(scoreImages);

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
