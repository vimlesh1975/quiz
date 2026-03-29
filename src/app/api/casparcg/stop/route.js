import { Socket } from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_HOST = process.env.CASPARCG_HOST || "127.0.0.1";
const DEFAULT_PORT = Number(process.env.CASPARCG_PORT || "5250");
const DEFAULT_CHANNEL = Number(process.env.CASPARCG_CHANNEL || "1");

function parsePositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
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
  let body = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const channel = parsePositiveNumber(body?.channel, DEFAULT_CHANNEL);
  const layers = Array.isArray(body?.layers) ? body.layers : [];
  const normalizedLayers = layers
    .map((layer) => parsePositiveNumber(layer, 0))
    .filter((layer) => layer > 0);

  if (normalizedLayers.length === 0) {
    return Response.json(
      { error: "layers must contain at least one positive layer number." },
      { status: 400 }
    );
  }

  const commands = normalizedLayers.map((layer) => `STOP ${channel}-${layer}`);

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
      commands,
      casparcgResponses,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to send stop command to CasparCG.",
        details: error.message,
        commands,
      },
      { status: 502 }
    );
  }
}
