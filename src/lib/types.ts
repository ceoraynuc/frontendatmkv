// src/lib/types.ts
//
// ─────────────────────────────────────────────────────────────────
// SHARED TYPES — used by frontend and backend
// Backend developer: implement endpoints returning these shapes.
// ─────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// API RESULT WRAPPER
// ═══════════════════════════════════════════════════════════════

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ═══════════════════════════════════════════════════════════════
// ROLES & PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export type Role =
  | "student"
  | "volunteer"
  | "manager"        // admin of a team
  | "super_admin";   // FLT / top level

/**
 * Super admin scope.
 * - "overall": full system (FLT)
 * - "11-12":   lead of 11-12 section only
 */
export type SuperAdminScope = "overall" | "11-12";

/**
 * Extra permissions that can be granted on top of primary role.
 * Example: a manager can also have "upload_content".
 */
export type Permission =
  | "upload_content"
  | "create_quizzes"
  | "manage_team"
  | "manage_projects"
  | "post_team_notifications"
  | "post_global_notifications"
  | "manage_subjects"
  | "manage_classes"
  | "manage_users"
  | "view_all_teams";

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
  teamIds: string[];                // teams this user belongs to
  joinedAt: string;                 // ISO date
  lastActiveAt: string;             // ISO date
  isActive: boolean;

  // Super admin only
  superAdminScope?: SuperAdminScope;

  // Student only
  grade?: string;
  enrolledSubjectIds?: string[];

  // Volunteer / Manager only
  qualification?: string;
  bio?: string;
}

export type UserProfileUpdate = Partial<
  Pick<
    UserProfile,
    | "fullName"
    | "email"
    | "phone"
    | "city"
    | "grade"
    | "qualification"
    | "bio"
    | "enrolledSubjectIds"
  >
>;

// ═══════════════════════════════════════════════════════════════
// TEAMS
// ═══════════════════════════════════════════════════════════════

export type TeamType = "school" | "admission";

export interface Team {
  id: string;
  name: string;                     // "9-10 Physics", "Admission"
  type: TeamType;
  classRange: string | null;        // "9-10", "11-12", null for admission
  subjectId: string | null;         // null for admission
  managerIds: string[];             // usually 1
  memberIds: string[];              // volunteers
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════
// SUBJECTS / CHAPTERS / VIDEOS
// ═══════════════════════════════════════════════════════════════

export interface Video {
  id: string;
  title: string;
  durationSeconds: number;
  videoUrl: string;
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
  grade: string;                    // "9-10", "11-12"
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
  createdBy: string;                // volunteer/manager id
  createdAt: string;
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
// RESOURCES (University, Admission, Past Papers, Guess Papers)
// ═══════════════════════════════════════════════════════════════

export type ResourceCategory =
  | "school"          // notes, videos for 9-12
  | "university"      // uni admission guides
  | "admission"       // interview, entry test
  | "general";        // random uploads

export type ResourceType =
  | "video"
  | "notes"
  | "quiz"
  | "past-paper"
  | "guess-paper"
  | "interview-guide"
  | "book"
  | "other";

export type ResourceFormat = "pdf" | "video" | "article" | "link" | "image" | "zip";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  resourceType: ResourceType;
  format: ResourceFormat;
  url: string;
  thumbnailUrl: string | null;
  subjectId: string | null;
  classRange: string | null;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
  sizeBytes: number | null;
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS / INITIATIVES
// ═══════════════════════════════════════════════════════════════

export type ProjectStatus = "upcoming" | "active" | "completed" | "cancelled";

export type ProjectRole =
  | "teacher"
  | "coordinator"
  | "content-creator"
  | "mentor"
  | "organizer"
  | "member";

export type ParticipationStatus =
  | "assigned"
  | "in-progress"
  | "completed"
  | "dropped";

export interface ProjectParticipant {
  userId: string;
  userName: string;
  role: ProjectRole;
  hoursContributed: number;
  status: ParticipationStatus;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  teamIds: string[];
  createdBy: string;
  createdAt: string;
  participants: ProjectParticipant[];
}

// ═══════════════════════════════════════════════════════════════
// Q&A  (Phase 1: internal only. Phase 2: public for students.)
// ═══════════════════════════════════════════════════════════════

export type QuestionScope = "internal" | "public";

export interface Answer {
  id: string;
  questionId: string;
  body: string;
  answeredBy: string;
  answeredByName: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  scope: QuestionScope;
  teamId: string | null;            // null = general
  askedBy: string;
  askedByName: string;
  tags: string[];
  answers: Answer[];
  views: number;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════
// DOWNLOADS (kept for compatibility with existing pages)
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
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

export type NotificationType =
  | "quiz"
  | "video"
  | "download"
  | "project"
  | "system"
  | "achievement"
  | "announcement";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  targetRoles: Role[] | null;       // null = everyone
  targetTeamIds: string[] | null;   // null = all teams
  createdBy: string;
  readBy: string[];                 // user IDs
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS / STATS / ACTIVITY
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

export interface ActivityItem {
  id: string;
  type: NotificationType;
  text: string;
  timestamp: string;
}

export interface WeeklyStudyHours {
  day: string;
  hours: number;
}

/**
 * Volunteer / Manager track record.
 * Used by managers and admins to see participation.
 */
export interface VolunteerStats {
  userId: string;
  userName: string;
  videosUploaded: number;
  notesUploaded: number;
  quizzesCreated: number;
  projectsJoined: number;
  projectsCompleted: number;
  totalHoursContributed: number;
  studentsHelped: number;
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
  role: Role;                       // who is registering
  grade?: string;                   // if student
  qualification?: string;           // if volunteer
  invitedBy?: string;               // if volunteer (manager id)
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