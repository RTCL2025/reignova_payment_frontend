export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pay-api.reignovatechnologies.com/api/v1";

/**
 * Origin of the payment API, without the versioned `/api/v1` prefix.
 *
 * `/health` is mounted outside the versioned router, so it cannot be reached by
 * appending to `API_BASE_URL`. Deriving it here keeps the health probe pointed at
 * whichever backend `NEXT_PUBLIC_API_URL` names — a hardcoded origin makes local
 * development silently monitor production.
 */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

const BASE_URL = API_BASE_URL;

export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string = "API_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cleanBase = BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Avoid caching for status and dynamic queries
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Request failed with status ${response.status}`;
    const code = data?.error?.code || "ERROR";
    throw new ApiError(message, response.status, code, data?.error?.details);
  }

  return data;
}
