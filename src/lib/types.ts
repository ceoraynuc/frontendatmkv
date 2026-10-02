// src/lib/types.ts
//
// VERSION 1 — Student + Admin only
// (Volunteer portal, manager, projects, Q&A, resources → V2)

// ═══════════════════════════════════════════════════════════════
// API RESULT
// ═══════════════════════════════════════════════════════════════

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ═══════════════════════════════════════════════════════════════
// ROLES
// ═══════════════════════════════════════════════════════════════

export type Role = "student" | "admin" | "super_admin";

export type Permission =
  | "manage_volunteers"
  | "manage_projects"
  | "post_notifications"
  | "manage_subjects"
  | "manage_classes"
  | "view_all_volunteers";

// ═══════════════════════════════════════════════════════════════
// USER
// ═══════════════════════════════════════════════════════════════

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  city: string;
  avatarUrl: string | null;
  primaryRole: Role;
  permissions: Permission[];
  teamIds: string[];
  joinedAt: string;
  lastActiveAt: string;
  isActive: boolean;

  // Student-specific
  grade?: string;
  enrolledSubjectIds?: string[];
}

export type UserProfileUpdate = Partial<
  Pick<
    UserProfile,
    | "fullName"
    | "email"
    | "phone"
    | "city"
    | "grade"
    | "enrolledSubjectIds"
  >
>;

// ═══════════════════════════════════════════════════════════════
// SUBJECTS / CHAPTERS / VIDEOS
// ═══════════════════════════════════════════════════════════════

export interface Video {
  id: string;
  title: string;
  durationSeconds: number;
  videoUrl: string;             // YouTube URL or direct link
  thumbnailUrl: string | null;
}

export interface Chapter {
  number: number;
  title: string;
  videos: Video[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  grade: string;                // "9-10", "11-12"
  thumbnailUrl: string | null;
  chapters: Chapter[];
}

export interface SubjectProgress {
  subjectId: string;
  done: number;
  total: number;
  percent: number;
}

// ═══════════════════════════════════════════════════════════════
// QUIZZES
// ═══════════════════════════════════════════════════════════════

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
}

export interface Quiz {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string | null;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  percent: number;
  attemptedAt: string;
  answers: number[];
}

// ═══════════════════════════════════════════════════════════════
// DOWNLOADS
// ═══════════════════════════════════════════════════════════════

export interface DownloadFile {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  fileUrl: string;
  fileType: "pdf" | "doc" | "image" | "zip" | "other";
  sizeBytes: number;
  uploadedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════

export interface NextVideo {
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  videoId: string;
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

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

export type NotificationType =
  | "quiz"
  | "video"
  | "download"
  | "system"
  | "announcement";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  targetRoles: Role[] | null;
  targetTeamIds: string[] | null;
  createdBy: string;
  readBy: string[];
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════
// ADMIN-SPECIFIC (Volunteer track record for admin view)
// ═══════════════════════════════════════════════════════════════

export interface VolunteerTrackRecord {
  userId: string;
  userName: string;
  email: string;
  city: string;
  teamNames: string[];
  projectsJoined: number;
  projectsCompleted: number;
  totalHoursContributed: number;
  joinedAt: string;
  lastActiveAt: string;
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  grade?: string;               // student
  role: Role;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: string;
}

// ═══════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════

export type AvatarSize = "sm" | "md" | "lg";
export type ThemeMode = "light" | "dark";