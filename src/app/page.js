import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const images = Array.from({ length: 10 }, (_, i) => `/image${i + 1}.svg`);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Gallery - 10 Images</h1>
        <div className={styles.gallery}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageContainer}>
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                width={400}
                height={300}
                priority={index < 3}
              />
              <button className={styles.showButton}>Show</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
