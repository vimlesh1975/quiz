import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");
const IMAGE_DIRECTORIES = {
  "IT samples Q&A": path.join(PUBLIC_DIRECTORY, "IT samples Q&A"),
  "IT samples score": path.join(PUBLIC_DIRECTORY, "IT samples score"),
};

async function getImagesFromDirectory(folderName) {
  const targetDirectory = IMAGE_DIRECTORIES[folderName];
  const entries = await readdir(targetDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((name) => `/${folderName}/${name}`);
}

export async function getQuizImages() {
  return getImagesFromDirectory("IT samples Q&A");
}

export async function getScoreImages() {
  return getImagesFromDirectory("IT samples score");
}

export function isAllowedQuizImage(imagePath) {
  const normalizedPath = imagePath.replaceAll("\\", "/");
  const matchingFolder = Object.keys(IMAGE_DIRECTORIES).find((folderName) =>
    normalizedPath.startsWith(`/${folderName}/`)
  );

  if (!matchingFolder) {
    return false;
  }

  const fileName = normalizedPath.slice(`/${matchingFolder}/`.length);
  const targetDirectory = IMAGE_DIRECTORIES[matchingFolder];
  const resolvedPath = path.resolve(targetDirectory, fileName);

  return (
    path.dirname(resolvedPath) === targetDirectory &&
    IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase())
  );
}
