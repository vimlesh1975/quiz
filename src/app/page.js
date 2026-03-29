import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const images = [
    '/IT samples Q&A/Q & A 1a.jpg',
    '/IT samples Q&A/Q & A 1b.jpg',
    '/IT samples Q&A/Q & A 2a.jpg',
    '/IT samples Q&A/Q & A 2b.jpg',
    '/IT samples Q&A/Q & A 2ba.jpg',
    '/IT samples Q&A/Q & A 2bb.jpg',
    '/IT samples Q&A/Q & A 2bc.jpg',
    '/IT samples Q&A/Q & A 2bd.jpg',
    '/IT samples Q&A/Q & A 2c.jpg',
    '/IT samples Q&A/Q & A 3a.jpg',
    '/IT samples Q&A/Q & A 3b.jpg'
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Gallery - 10 Images</h1>
        <div className={styles.gallery}>
          {images.map((image, index) => {
            const filename = image.split('/').pop();
            return (
              <div key={index} className={styles.imageContainer}>
                <h3 className={styles.imageTitle}>{filename}</h3>
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={400}
                  height={300}
                  priority={index < 3}
                />
                <button className={styles.showButton}>Show</button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
