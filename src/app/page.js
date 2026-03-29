import GalleryClient from "./components/gallery-client";
import styles from "./page.module.css";
import { quizImages } from "@/lib/quiz-images";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Gallery - All Images</h1>
        <GalleryClient images={quizImages} />
      </main>
    </div>
  );
}
