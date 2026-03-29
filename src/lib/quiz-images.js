import { readdir } from "node:fs/promises";
import path from "node:path";

const QUIZ_IMAGES_DIRECTORY = path.join(
  process.cwd(),
  "public",
  "IT samples Q&A"
);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export async function getQuizImages() {
  const entries = await readdir(QUIZ_IMAGES_DIRECTORY, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((name) => `/IT samples Q&A/${name}`);
}

export function isAllowedQuizImage(imagePath) {
  const normalizedPath = imagePath.replaceAll("\\", "/");

  if (!normalizedPath.startsWith("/IT samples Q&A/")) {
    return false;
  }

  const fileName = normalizedPath.slice("/IT samples Q&A/".length);
  const resolvedPath = path.resolve(QUIZ_IMAGES_DIRECTORY, fileName);

  return (
    path.dirname(resolvedPath) === QUIZ_IMAGES_DIRECTORY &&
    IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase())
  );
}
