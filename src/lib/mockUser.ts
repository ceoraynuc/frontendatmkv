import { getSubjectById, type Subject } from "./mockCourses";

// Every function returns { success, data } or { success, error }
// so swapping to a real API later is a one-line change per call.
export type Result<T> = { success: true; data: T } | { success: false; error: string };

export interface UserProfile {
  id: string;
  fullName: string;
  email: string; // read-only: tied to login
  phone: string;
  school: string;
  city: string;
  grade: string; // read-only: changed by an admin/volunteer
  role: "student";
  enrolledSubjectIds: string[]; // matches ids in mockSubjects.ts
  joinedAt: string; // ISO date
}

export type EditableProfileFields = Pick<UserProfile, "fullName" | "phone" | "school" | "city">;

export interface NotificationPrefs {
  emailAlerts: boolean;
  newContentAlerts: boolean;
}

const PROFILE_KEY = "user-profile";
const AVATAR_KEY = "user-avatar";
const PREFS_KEY = "user-notification-prefs";

const defaultProfile: UserProfile = {
  id: "u1",
  fullName: "Ali Raza",
  email: "ali.raza@example.com",
  phone: "",
  school: "",
  city: "",
  grade: "Grade 10",
  role: "student",
  enrolledSubjectIds: ["physics", "chemistry", "mathematics"],
  joinedAt: "2026-09-01T00:00:00.000Z",
};

const defaultPrefs: NotificationPrefs = { emailAlerts: true, newContentAlerts: true };

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function notify(eventName: string) {
  window.dispatchEvent(new Event(eventName));
}

// --- Profile ---
export function getUserProfile(): Result<UserProfile> {
  const saved = readJSON<Partial<EditableProfileFields>>(PROFILE_KEY);
  return { success: true, data: { ...defaultProfile, ...saved } };
}

export function updateUserProfile(updates: EditableProfileFields): Result<UserProfile> {
  const fullName = updates.fullName.trim();
  if (fullName.length < 2) return { success: false, error: "Enter your full name (at least 2 characters)." };

  const clean: EditableProfileFields = {
    fullName,
    phone: updates.phone.trim(),
    school: updates.school.trim(),
    city: updates.city.trim(),
  };
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
  } catch {
    return { success: false, error: "Could not save your changes. Try again." };
  }
  notify("profile-changed");
  return { success: true, data: { ...defaultProfile, ...clean } };
}

// --- Avatar (data URL in localStorage until a real upload endpoint exists) ---
export function getAvatar(): Result<string | null> {
  if (typeof window === "undefined") return { success: true, data: null };
  try {
    return { success: true, data: localStorage.getItem(AVATAR_KEY) };
  } catch {
    return { success: true, data: null };
  }
}

export function setAvatar(dataUrl: string | null): Result<null> {
  try {
    if (dataUrl) localStorage.setItem(AVATAR_KEY, dataUrl);
    else localStorage.removeItem(AVATAR_KEY);
  } catch {
    return { success: false, error: "Could not save your photo. Try a smaller one." };
  }
  notify("avatar-changed");
  return { success: true, data: null };
}

// Crops to a centered square and shrinks to size x size, so avatars stay small and round-friendly.
export function resizeImageToSquare(file: File, size = 256): Promise<Result<string>> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return resolve({ success: false, error: "Your browser can't process images." });
      }
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve({ success: true, data: canvas.toDataURL("image/jpeg", 0.85) });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ success: false, error: "That file could not be read as an image." });
    };
    img.src = url;
  });
}

// --- Notification preferences ---
export function getNotificationPrefs(): Result<NotificationPrefs> {
  return { success: true, data: { ...defaultPrefs, ...readJSON<Partial<NotificationPrefs>>(PREFS_KEY) } };
}

export function setNotificationPrefs(prefs: NotificationPrefs): Result<NotificationPrefs> {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    return { success: false, error: "Could not save your preferences." };
  }
  return { success: true, data: prefs };
}

// --- Account ---
// The current password is only checked for being filled in here. The real check happens on the server.
export function changePassword(currentPassword: string, newPassword: string): Result<null> {
  if (!currentPassword) return { success: false, error: "Enter your current password." };
  if (newPassword.length < 8) return { success: false, error: "New password must be at least 8 characters." };
  if (newPassword === currentPassword) return { success: false, error: "New password must be different from the current one." };
  return { success: true, data: null };
}

export function logout(): Result<null> {
  return { success: true, data: null };
}

// --- Stats (derived from subjects + watched videos, so every page shows the same numbers) ---
export interface NextVideo {
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  chapterTitle: string;
  videoTitle: string;
}

export interface ProfileStats {
  subjectsEnrolled: number;
  videosWatched: number;
  totalVideos: number;
  chaptersCompleted: number;
  totalChapters: number;
  overallPercent: number;
  nextVideo: NextVideo | null;
}

export function getProfileStats(profile: UserProfile, watchedIds: string[]): Result<ProfileStats> {
  const subjects = profile.enrolledSubjectIds
    .map((id) => getSubjectById(id))
    .filter((s): s is Subject => Boolean(s));

  let totalVideos = 0;
  let videosWatched = 0;
  let totalChapters = 0;
  let chaptersCompleted = 0;
  let nextVideo: NextVideo | null = null;

  for (const subject of subjects) {
    for (const chapter of subject.chapters) {
      const done = chapter.videos.filter((v) => watchedIds.includes(v.id)).length;
      totalChapters += 1;
      totalVideos += chapter.videos.length;
      videosWatched += done;
      if (chapter.videos.length > 0 && done === chapter.videos.length) chaptersCompleted += 1;

      if (!nextVideo) {
        const upcoming = chapter.videos.find((v) => !watchedIds.includes(v.id));
        if (upcoming) {
          nextVideo = {
            subjectId: subject.id,
            subjectName: subject.name,
            chapterNumber: chapter.chapterNumber,
            chapterTitle: chapter.title,
            videoTitle: upcoming.title,
          };
        }
      }
    }
  }

  return {
    success: true,
    data: {
      subjectsEnrolled: subjects.length,
      videosWatched,
      totalVideos,
      chaptersCompleted,
      totalChapters,
      overallPercent: totalVideos === 0 ? 0 : Math.round((videosWatched / totalVideos) * 100),
      nextVideo,
    },
  };
}
export function updateAvatar(
  dataUrl: string | null
): { success: true } | { success: false; error: string } {
  try {
    if (dataUrl) {
      localStorage.setItem("mkv_user_avatar", dataUrl);
    } else {
      localStorage.removeItem("mkv_user_avatar");
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save photo." };
  }
}