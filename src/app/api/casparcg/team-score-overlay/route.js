export const dynamic = "force-dynamic";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getScore(searchParams, key) {
  return escapeHtml(searchParams.get(key) || "000");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team1 = getScore(searchParams, "team1");
  const team2 = getScore(searchParams, "team2");
  const team3 = getScore(searchParams, "team3");
  const team4 = getScore(searchParams, "team4");

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1920, initial-scale=1" />
    <title>Team Scores</title>
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
        position: relative;
      }

      .score {
        position: absolute;
        width: 180px;
        text-align: center;
        font-size: 72px;
        font-weight: 700;
        line-height: 1;
        color: #ffd400;
      }

      .team1 {
        left: 175px;
        top: 615px;
      }

      .team2 {
        left: 495px;
        top: 615px;
      }

      .team3 {
        left: 1245px;
        top: 615px;
      }

      .team4 {
        left: 1565px;
        top: 615px;
      }
    </style>
  </head>
  <body>
    <div class="score team1">${team1}</div>
    <div class="score team2">${team2}</div>
    <div class="score team3">${team3}</div>
    <div class="score team4">${team4}</div>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
