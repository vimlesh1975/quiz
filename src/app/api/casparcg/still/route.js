import { isAllowedQuizImage } from "@/lib/quiz-images";

export const dynamic = "force-dynamic";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get("image");

  if (!imagePath || !isAllowedQuizImage(imagePath)) {
    return new Response("Image not found.", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const escapedImageUrl = escapeHtml(imagePath);
  const escapedTitle = escapeHtml(imagePath.split("/").pop() || "Quiz image");

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapedTitle}</title>
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
      }

      body {
        display: grid;
        place-items: center;
      }

      img {
        max-width: 100vw;
        max-height: 100vh;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
      }
    </style>
  </head>
  <body>
    <img src="${escapedImageUrl}" alt="${escapedTitle}" />
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
