import { Socket } from "node:net";
import path from "node:path";
import { isAllowedQuizImage } from "@/lib/quiz-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_HOST = process.env.CASPARCG_HOST || "127.0.0.1";
const DEFAULT_PORT = Number(process.env.CASPARCG_PORT || "5250");
const DEFAULT_CHANNEL = Number(process.env.CASPARCG_CHANNEL || "1");
const DEFAULT_LAYER = Number(process.env.CASPARCG_LAYER || "10");
const DEFAULT_SCORE_HTML_LAYER = Number(process.env.CASPARCG_SCORE_HTML_LAYER || "20");
const DEFAULT_SCORE_OVERLAY_LAYER = Number(process.env.CASPARCG_SCORE_OVERLAY_LAYER || "11");

function parsePositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getRenderBaseUrl(request) {
  const configuredBaseUrl = process.env.CASPARCG_RENDER_BASE_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const requestUrl = new URL(request.url);
  return requestUrl.origin;
}

function buildAssetUrl(assetPath, renderBaseUrl) {
  const isHtmlAsset = [".html", ".htm"].includes(path.extname(assetPath).toLowerCase());

  return isHtmlAsset
    ? new URL(assetPath, renderBaseUrl).toString()
    : new URL(
        `/api/casparcg/still?image=${encodeURIComponent(assetPath)}`,
        renderBaseUrl
      ).toString();
}

function sendAmcpCommand(command, host, port) {
  return new Promise((resolve, reject) => {
    const socket = new Socket();
    let settled = false;
    let responseText = "";

    function finish(handler, value) {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      handler(value);
    }

    socket.setEncoding("utf8");
    socket.setTimeout(5000);

    socket.on("connect", () => {
      socket.write(`${command}\r\n`);
    });

    socket.on("data", (chunk) => {
      responseText += chunk;

      if (responseText.includes("\r\n")) {
        finish(resolve, responseText.trim());
      }
    });

    socket.on("timeout", () => {
      finish(reject, new Error("Timed out waiting for CasparCG response."));
    });

    socket.on("error", (error) => {
      finish(reject, error);
    });

    socket.on("close", () => {
      if (!settled) {
        finish(resolve, responseText.trim() || "Command sent.");
      }
    });

    socket.connect(port, host);
  });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const imagePath = body?.imagePath;
  const overlayPath = body?.overlayPath;
  const overlayValue = typeof body?.overlayValue === "string" ? body.overlayValue : "";
  const overlayValues =
    body?.overlayValues && typeof body.overlayValues === "object"
      ? body.overlayValues
      : null;
  const overlayType = typeof body?.overlayType === "string" ? body.overlayType : "";

  if (!imagePath || !isAllowedQuizImage(imagePath)) {
    return Response.json(
      { error: "imagePath must match one of the quiz images in /public." },
      { status: 400 }
    );
  }

  if (overlayPath && !isAllowedQuizImage(overlayPath)) {
    return Response.json(
      { error: "overlayPath must match one of the allowed assets in /public." },
      { status: 400 }
    );
  }

  const channel = parsePositiveNumber(body?.channel, DEFAULT_CHANNEL);
  const isHtmlAsset = [".html", ".htm"].includes(path.extname(imagePath).toLowerCase());
  const defaultLayer = isHtmlAsset ? DEFAULT_SCORE_HTML_LAYER : DEFAULT_LAYER;
  const layer = parsePositiveNumber(body?.layer, defaultLayer);
  const renderBaseUrl = getRenderBaseUrl(request);
  const assetUrl = buildAssetUrl(imagePath, renderBaseUrl);
  const commands = [`PLAY ${channel}-${layer} [HTML] "${assetUrl}"`];

  if (overlayPath) {
    const overlayLayer = parsePositiveNumber(
      body?.overlayLayer,
      DEFAULT_SCORE_OVERLAY_LAYER
    );
    const overlayUrl =
      overlayType === "team" && overlayPath === "/IT score html/team-scores.html"
        ? new URL(
            `/api/casparcg/team-score-overlay?team1=${encodeURIComponent(
              String(overlayValues?.team1 ?? "000")
            )}&team2=${encodeURIComponent(
              String(overlayValues?.team2 ?? "000")
            )}&team3=${encodeURIComponent(
              String(overlayValues?.team3 ?? "000")
            )}&team4=${encodeURIComponent(
              String(overlayValues?.team4 ?? "000")
            )}`,
            renderBaseUrl
          ).toString()
        : overlayValue && overlayPath === "/IT score html/score-200.html"
        ? new URL(
            `/api/casparcg/score-overlay?value=${encodeURIComponent(overlayValue)}`,
            renderBaseUrl
          ).toString()
        : buildAssetUrl(overlayPath, renderBaseUrl);
    commands.push(`PLAY ${channel}-${overlayLayer} [HTML] "${overlayUrl}"`);
  }

  try {
    const casparcgResponses = [];

    for (const command of commands) {
      const casparcgResponse = await sendAmcpCommand(
        command,
        DEFAULT_HOST,
        DEFAULT_PORT
      );
      casparcgResponses.push(casparcgResponse);
    }

    return Response.json({
      ok: true,
      imagePath,
      imageUrl: assetUrl,
      commands,
      casparcgResponses,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to send command to CasparCG.",
        details: error.message,
        commands,
      },
      { status: 502 }
    );
  }
}
