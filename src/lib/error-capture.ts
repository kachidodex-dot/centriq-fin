/**
 * Error capture system for out-of-band error handling.
 * Captures errors that h3/Nitro swallows into generic 500 responses
 * so server.ts can recover the original stack trace.
 */

interface CapturedError {
  error: unknown;
  at: number;
  source: "uncaught" | "unhandledRejection";
}

let lastCapturedError: CapturedError | undefined;
const TTL_MS = 5_000;

/**
 * Records an error with timestamp and source information
 * @param error The error to capture
 * @param source The source of the error
 */
function recordError(error: unknown, source: "uncaught" | "unhandledRejection"): void {
  lastCapturedError = { error, at: Date.now(), source };
  logError(error, source);
}

/**
 * Logs error details to console with structured format
 * @param error The error object
 * @param source Where the error came from
 */
function logError(error: unknown, source: "uncaught" | "unhandledRejection"): void {
  const timestamp = new Date().toISOString();
  const errorMsg = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(
    JSON.stringify({
      timestamp,
      source,
      message: errorMsg,
      stack: stack || "No stack available",
    }),
  );
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) =>
    recordError((event as ErrorEvent).error ?? event, "uncaught"),
  );
  globalThis.addEventListener("unhandledrejection", (event) =>
    recordError((event as PromiseRejectionEvent).reason, "unhandledRejection"),
  );
}

/**
 * Consumes and returns the last captured error if still valid (within TTL).
 * Clears the captured error after consumption.
 * @returns The captured error or undefined if expired/not set
 */
export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;

  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }

  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
