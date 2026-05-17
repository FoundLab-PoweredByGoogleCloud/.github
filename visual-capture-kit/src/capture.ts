import { chromium, type ViewportSize } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

type ViewportTarget = {
  label: string;
  viewport: ViewportSize;
};

type CaptureResult = {
  route: string;
  url: string;
  viewport: string;
  file: string;
  ok: boolean;
  durationMs: number;
  status?: number;
  error?: string;
};

const captureUrl = mustGetEnv("CAPTURE_URL");
const outputDir = process.env.CAPTURE_DIR ?? "artifacts/screenshots";
const waitMs = readNumberEnv("CAPTURE_WAIT_MS", 2500);
const navigationTimeoutMs = readNumberEnv("CAPTURE_NAVIGATION_TIMEOUT_MS", 30_000);
const readyTimeoutMs = readNumberEnv("CAPTURE_READY_TIMEOUT_MS", 15_000);
const fullPage = process.env.CAPTURE_FULL_PAGE !== "false";
const readySelector = process.env.CAPTURE_READY_SELECTOR;
const failFast = process.env.CAPTURE_FAIL_FAST === "true";

const routes = readRoutes(process.env.CAPTURE_ROUTES);
const viewports = readViewports(process.env.CAPTURE_VIEWPORTS_JSON);

function mustGetEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

function readNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) return fallback;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid numeric env var: ${name}=${value}`);
  }

  return parsed;
}

function readRoutes(value: string | undefined): string[] {
  if (!value) return [""];

  return value
    .split(",")
    .map((route) => route.trim())
    .filter(Boolean);
}

function readViewports(value: string | undefined): ViewportTarget[] {
  if (!value) {
    return [
      {
        label: "desktop",
        viewport: { width: 1440, height: 900 },
      },
      {
        label: "mobile",
        viewport: { width: 390, height: 844 },
      },
    ];
  }

  const parsed = JSON.parse(value) as ViewportTarget[];

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("CAPTURE_VIEWPORTS_JSON must be a non-empty JSON array");
  }

  for (const target of parsed) {
    if (!target.label || !target.viewport?.width || !target.viewport?.height) {
      throw new Error("Invalid viewport target in CAPTURE_VIEWPORTS_JSON");
    }
  }

  return parsed;
}

function resolveTargetUrl(base: string, route: string): string {
  if (!route) return base;

  if (route.startsWith("http://") || route.startsWith("https://")) {
    return route;
  }

  return new URL(route, ensureTrailingSlash(base)).toString();
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function safeSegment(value: string): string {
  const normalized = value
    .replace(/^https?:\/\//, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return normalized || "root";
}

async function captureOne(route: string, target: ViewportTarget): Promise<CaptureResult> {
  const startedAt = performance.now();
  const targetUrl = resolveTargetUrl(captureUrl, route);
  const routeSegment = safeSegment(route || "root");
  const fileName = `${routeSegment}-${target.label}.png`;
  const outputPath = path.join(outputDir, fileName);

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: target.viewport,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });

    const page = await context.newPage();

    console.log(
      JSON.stringify({
        event: "capture.start",
        route,
        url: targetUrl,
        viewport: target.label,
        outputPath,
      })
    );

    const response = await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: navigationTimeoutMs,
    });

    const status = response?.status();

    if (!response?.ok()) {
      throw new Error(`HTTP ${status ?? "unknown"} for ${targetUrl}`);
    }

    if (readySelector) {
      await page.waitForSelector(readySelector, {
        state: "visible",
        timeout: readyTimeoutMs,
      });
    }

    await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {
      console.log(
        JSON.stringify({
          event: "capture.networkidle.timeout",
          route,
          viewport: target.label,
        })
      );
    });

    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }

    await fs.mkdir(outputDir, { recursive: true });

    await page.screenshot({
      path: outputPath,
      fullPage,
    });

    const durationMs = Math.round(performance.now() - startedAt);

    console.log(
      JSON.stringify({
        event: "capture.saved",
        route,
        url: targetUrl,
        viewport: target.label,
        file: outputPath,
        durationMs,
      })
    );

    return {
      route,
      url: targetUrl,
      viewport: target.label,
      file: outputPath,
      ok: true,
      durationMs,
      status,
    };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    const message = error instanceof Error ? error.message : String(error);

    console.error(
      JSON.stringify({
        event: "capture.failed",
        route,
        url: targetUrl,
        viewport: target.label,
        error: message,
        durationMs,
      })
    );

    return {
      route,
      url: targetUrl,
      viewport: target.label,
      file: outputPath,
      ok: false,
      durationMs,
      error: message,
    };
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(
    JSON.stringify({
      event: "capture.config",
      captureUrl,
      outputDir,
      waitMs,
      navigationTimeoutMs,
      readyTimeoutMs,
      readySelector: readySelector ?? null,
      fullPage,
      routes,
      viewports,
    })
  );

  const results: CaptureResult[] = [];

  for (const route of routes) {
    for (const viewport of viewports) {
      const result = await captureOne(route, viewport);
      results.push(result);

      if (!result.ok && failFast) {
        break;
      }
    }
  }

  await fs.mkdir(outputDir, { recursive: true });

  const manifestPath = path.join(outputDir, "manifest.json");
  const failed = results.filter((result) => !result.ok);

  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        schema: "foundlab.visual_capture.v1",
        generatedAt: new Date().toISOString(),
        input: {
          captureUrl,
          routes,
          viewports,
          fullPage,
          waitMs,
          readySelector: readySelector ?? null,
        },
        summary: {
          total: results.length,
          passed: results.length - failed.length,
          failed: failed.length,
        },
        results,
      },
      null,
      2
    )
  );

  console.log(JSON.stringify({ event: "capture.manifest.saved", file: manifestPath }));

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ event: "capture.fatal", error: String(error) }));
  process.exit(1);
});
