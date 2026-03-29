import Image from "next/image";
import CasparShowButton from "./components/caspar-show-button";
import styles from "./page.module.css";
import { quizImages } from "@/lib/quiz-images";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Gallery - All Images</h1>
        <div className={styles.gallery}>
          {quizImages.map((image, index) => {
            const filename = image.split('/').pop();
            return (
              <div key={index} className={styles.imageContainer}>
                <h3 className={styles.imageTitle}>{filename}</h3>
                <div className={styles.imageRow}>
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={400}
                    height={300}
                    priority={index < 3}
                  />
                  <CasparShowButton imagePath={image} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
