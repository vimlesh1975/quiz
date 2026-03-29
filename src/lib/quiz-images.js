export const quizImages = [
  "/IT samples Q&A/Q & A 1a.jpg",
  "/IT samples Q&A/Q & A 1b.jpg",
  "/IT samples Q&A/Q & A 2a.jpg",
  "/IT samples Q&A/Q & A 2b.jpg",
  "/IT samples Q&A/Q & A 2ba.jpg",
  "/IT samples Q&A/Q & A 2bb.jpg",
  "/IT samples Q&A/Q & A 2bc.jpg",
  "/IT samples Q&A/Q & A 2bd.jpg",
  "/IT samples Q&A/Q & A 2c.jpg",
  "/IT samples Q&A/Q & A 3a.jpg",
  "/IT samples Q&A/Q & A 3b.jpg",
];

export function isAllowedQuizImage(imagePath) {
  return quizImages.includes(imagePath);
}
