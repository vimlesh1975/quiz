import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const HTML_EXTENSIONS = new Set([".html", ".htm"]);
const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");
const ASSET_DIRECTORIES = {
  "IT samples Q&A": path.join(PUBLIC_DIRECTORY, "IT samples Q&A"),
  "IT samples score": path.join(PUBLIC_DIRECTORY, "IT samples score"),
  "IT score html": path.join(PUBLIC_DIRECTORY, "IT score html"),
};

async function getImagesFromDirectory(folderName) {
  const targetDirectory = ASSET_DIRECTORIES[folderName];
  const entries = await readdir(targetDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => {
      const extension = path.extname(name).toLowerCase();
      return (
        IMAGE_EXTENSIONS.has(extension) ||
        (folderName === "IT samples score" && HTML_EXTENSIONS.has(extension))
      );
    })
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
  const matchingFolder = Object.keys(ASSET_DIRECTORIES).find((folderName) =>
    normalizedPath.startsWith(`/${folderName}/`)
  );

  if (!matchingFolder) {
    return false;
  }

  const fileName = normalizedPath.slice(`/${matchingFolder}/`.length);
  const targetDirectory = ASSET_DIRECTORIES[matchingFolder];
  const resolvedPath = path.resolve(targetDirectory, fileName);
  const extension = path.extname(fileName).toLowerCase();

  return (
    path.dirname(resolvedPath) === targetDirectory &&
    (IMAGE_EXTENSIONS.has(extension) ||
      ((matchingFolder === "IT samples score" ||
        matchingFolder === "IT score html") &&
        HTML_EXTENSIONS.has(extension)))
  );
}
