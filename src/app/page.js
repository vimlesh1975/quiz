import GalleryClient from "./components/gallery-client";
import styles from "./page.module.css";
import { getQuizImages } from "@/lib/quiz-images";

export const dynamic = "force-dynamic";

export default async function Home() {
  const quizImages = await getQuizImages();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <GalleryClient images={quizImages} />
      </main>
    </div>
  );
}
