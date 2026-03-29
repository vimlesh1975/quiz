import { Socket } from "node:net";
import { isAllowedQuizImage } from "@/lib/quiz-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_HOST = process.env.CASPARCG_HOST || "127.0.0.1";
const DEFAULT_PORT = Number(process.env.CASPARCG_PORT || "5250");
const DEFAULT_CHANNEL = Number(process.env.CASPARCG_CHANNEL || "1");
const DEFAULT_LAYER = Number(process.env.CASPARCG_LAYER || "10");

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

  if (!imagePath || !isAllowedQuizImage(imagePath)) {
    return Response.json(
      { error: "imagePath must match one of the quiz images in /public." },
      { status: 400 }
    );
  }

  const channel = parsePositiveNumber(body?.channel, DEFAULT_CHANNEL);
  const layer = parsePositiveNumber(body?.layer, DEFAULT_LAYER);
  const renderBaseUrl = getRenderBaseUrl(request);
  const imageUrl = new URL(
    `/api/casparcg/still?image=${encodeURIComponent(imagePath)}`,
    renderBaseUrl
  ).toString();
  const command = `PLAY ${channel}-${layer} [HTML] "${imageUrl}"`;

  try {
    const casparcgResponse = await sendAmcpCommand(
      command,
      DEFAULT_HOST,
      DEFAULT_PORT
    );

    return Response.json({
      ok: true,
      imagePath,
      imageUrl,
      command,
      casparcgResponse,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to send command to CasparCG.",
        details: error.message,
        command,
      },
      { status: 502 }
    );
  }
}
