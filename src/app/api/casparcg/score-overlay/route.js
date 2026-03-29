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
  const value = searchParams.get("value") || "000";
  const escapedValue = escapeHtml(value);

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1920, initial-scale=1" />
    <title>Score Overlay</title>
    <style>
      html,
      body {
        width: 1920px;
        height: 1080px;
        margin: 0;
        overflow: hidden;
        background: transparent;
        font-family: Arial, Helvetica, sans-serif;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .score {
        font-size: 90px;
        font-weight: 700;
        line-height: 1;
        color: #ffd400;
        transform: translateY(20px);
      }
    </style>
  </head>
  <body>
    <div class="score">${escapedValue}</div>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
