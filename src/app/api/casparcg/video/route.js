import { isAllowedAsset } from "@/lib/quiz-images";

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
  const src = searchParams.get("src");

  if (!src || !isAllowedAsset(src)) {
    return new Response("Video not found.", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const escapedSrc = escapeHtml(src);
  const escapedTitle = escapeHtml(src.split("/").pop() || "Video");

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapedTitle}</title>
    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: #000;
      }

      body {
        display: grid;
        place-items: center;
      }

      video {
        width: 100vw;
        height: 100vh;
        object-fit: contain;
        background: #000;
      }
    </style>
  </head>
  <body>
    <video autoplay muted loop playsinline>
      <source src="${escapedSrc}" />
    </video>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
