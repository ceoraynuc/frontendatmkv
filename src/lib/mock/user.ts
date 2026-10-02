// src/lib/mock/user.ts
import type { UserProfile, ProfileStats, ApiResult } from "@/lib/types";

const PROFILE_KEY = "mkv_user_profile";
const AVATAR_KEY = "mkv_user_avatar";

export function getUserProfile(): ApiResult<UserProfile> {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return { success: false, error: "No profile found" };
    }
    return { success: true, data: JSON.parse(raw) as UserProfile };
  } catch {
    return { success: false, error: "Failed to read profile" };
  }
}

export function updateUserProfile(
  updates: Partial<UserProfile>
): ApiResult<UserProfile> {
  try {
    const current = getUserProfile();
    if (!current.success) return current;
    const updated: UserProfile = {
      ...current.data,
      ...updates,
      id: current.data.id,
      joinedAt: current.data.joinedAt,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return { success: true, data: updated };
  } catch {
    return { success: false, error: "Failed to save profile" };
  }
}

export function getProfileStats(): ApiResult<ProfileStats> {
  // ... calculate from mockSubjects
}

export async function uploadAvatar(
  file: File
): Promise<ApiResult<{ avatarUrl: string }>> {
  const dataUrl = await resizeImageToSquare(file);
  if (!dataUrl.success) return dataUrl;
  localStorage.setItem(AVATAR_KEY, dataUrl.data);
  return { success: true, data: { avatarUrl: dataUrl.data } };
}

export function logout(): ApiResult<void> {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(AVATAR_KEY);
  return { success: true, data: undefined };
}