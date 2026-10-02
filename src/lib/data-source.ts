// src/lib/data-source.ts

/**
 * Controls whether the app reads from mock data or the real API.
 * Flip to "api" once the backend is deployed.
 */
export const DATA_SOURCE: "mock" | "api" =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as "mock" | "api") ?? "mock";

export const isMock = DATA_SOURCE === "mock";