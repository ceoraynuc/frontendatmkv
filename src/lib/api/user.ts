// src/lib/api/user.ts
import type {
  UserProfile,
  ProfileStats,
  ApiResult,
} from "@/lib/types";
import { isMock } from "@/lib/data-source";

// ── Real API base URL ──
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

// ── Public interface (pages yeh use karenge) ──
export async function getUserProfile(): Promise<ApiResult<UserProfile>> {
  if (isMock) {
    const { getUserProfile: mock } = await import("@/lib/mock/user");
    return mock();
  }
  return fetchJson<UserProfile>(`${API_BASE}/me`);
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<ApiResult<UserProfile>> {
  if (isMock) {
    const { updateUserProfile: mock } = await import("@/lib/mock/user");
    return mock(updates);
  }
  return fetchJson<UserProfile>(`${API_BASE}/me`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function getProfileStats(): Promise<ApiResult<ProfileStats>> {
  if (isMock) {
    const { getProfileStats: mock } = await import("@/lib/mock/user");
    return mock();
  }
  return fetchJson<ProfileStats>(`${API_BASE}/me/stats`);
}

export async function uploadAvatar(
  file: File
): Promise<ApiResult<{ avatarUrl: string }>> {
  if (isMock) {
    const { uploadAvatar: mock } = await import("@/lib/mock/user");
    return mock(file);
  }
  const formData = new FormData();
  formData.append("avatar", file);
  return fetchJson<{ avatarUrl: string }>(`${API_BASE}/me/avatar`, {
    method: "POST",
    body: formData,
  });
}

export async function logout(): Promise<ApiResult<void>> {
  if (isMock) {
    const { logout: mock } = await import("@/lib/mock/user");
    return mock();
  }
  return fetchJson<void>(`${API_BASE}/auth/logout`, { method: "POST" });
}

// ── Helper ──
async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as T;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}