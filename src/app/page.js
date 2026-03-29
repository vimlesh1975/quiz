import GalleryClient from "./components/gallery-client";
import styles from "./page.module.css";
import { getQuizImages, getScoreImages } from "@/lib/quiz-images";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [quizImages, scoreImages] = await Promise.all([
    getQuizImages(),
    getScoreImages(),
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.galleryColumns}>
          <div className={styles.scrollColumn}>
            <GalleryClient
              title="Gallery - All Images"
              images={quizImages}
              refreshLabel="Refresh Gallery"
            />
          </div>
          <div className={styles.scrollColumn}>
            <GalleryClient
              title="Score - All Images"
              images={scoreImages}
              refreshLabel="Refresh Scores"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
