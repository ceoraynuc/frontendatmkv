export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string; // TODO: paste the MKV channel video link here
  durationMinutes: number;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  quizId?: string; // matches an id in mockQuizzes.ts
  videos: Video[];
}

export interface Subject {
  id: string;
  name: string;
  grade: string;
  description: string;
  chapters: Chapter[];
}

export const mockSubjects: Subject[] = [
  {
    id: "physics",
    name: "Physics",
    grade: "Grade 10",
    description: "Motion, forces, gravitation and energy.",
    chapters: [
      {
        id: "phy-1",
        chapterNumber: 1,
        title: "Newton's Laws of Motion",
        quizId: "q2",
        videos: [
          { id: "phy-1-1", title: "Newton's First Law — Inertia", description: "Why objects resist changes in their motion.", youtubeUrl: "", durationMinutes: 8 },
          { id: "phy-1-2", title: "Newton's Second Law — F = ma", description: "How force, mass and acceleration are related.", youtubeUrl: "", durationMinutes: 10 },
          { id: "phy-1-3", title: "Newton's Third Law — Action and Reaction", description: "Equal and opposite forces explained with examples.", youtubeUrl: "", durationMinutes: 7 },
        ],
      },
      {
        id: "phy-2",
        chapterNumber: 2,
        title: "Gravitation",
        videos: [
          { id: "phy-2-1", title: "Universal Law of Gravitation", description: "Newton's law and the gravitational constant.", youtubeUrl: "", durationMinutes: 9 },
          { id: "phy-2-2", title: "Gravity on Earth and Free Fall", description: "Acceleration due to gravity and free fall.", youtubeUrl: "", durationMinutes: 8 },
        ],
      },
      {
        id: "phy-3",
        chapterNumber: 3,
        title: "Work and Energy",
        videos: [
          { id: "phy-3-1", title: "Work and Power", description: "Definitions, formulas and units.", youtubeUrl: "", durationMinutes: 9 },
          { id: "phy-3-2", title: "Kinetic and Potential Energy", description: "Types of mechanical energy and conservation.", youtubeUrl: "", durationMinutes: 10 },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    grade: "Grade 10",
    description: "Bonding, organic chemistry and more.",
    chapters: [
      {
        id: "chem-1",
        chapterNumber: 1,
        title: "Chemical Bonding",
        quizId: "q1",
        videos: [
          { id: "chem-1-1", title: "Ionic Bonds", description: "Electron transfer between metals and non-metals.", youtubeUrl: "https://youtu.be/_YyjjtUvXg8?si=FT0cUpdo4u2Qh30K", durationMinutes: 9 },
          { id: "chem-1-2", title: "Covalent Bonds", description: "Sharing of electron pairs.", youtubeUrl: "https://youtu.be/_YyjjtUvXg8?si=FT0cUpdo4u2Qh30K", durationMinutes: 10 },
          { id: "chem-1-3", title: "Metallic Bonds", description: "The sea of delocalized electrons.", youtubeUrl: "https://youtu.be/_YyjjtUvXg8?si=FT0cUpdo4u2Qh30K", durationMinutes: 7 },
        ],
      },
      {
        id: "chem-2",
        chapterNumber: 2,
        title: "Organic Chemistry Basics",
        quizId: "q3",
        videos: [
          { id: "chem-2-1", title: "Alkanes and Their Formula", description: "Saturated hydrocarbons and CnH2n+2.", youtubeUrl: "https://youtu.be/_YyjjtUvXg8?si=FT0cUpdo4u2Qh30K", durationMinutes: 9 },
          { id: "chem-2-2", title: "Functional Groups", description: "-OH, -COOH, -CHO and more.", youtubeUrl: "https://youtu.be/_YyjjtUvXg8?si=FT0cUpdo4u2Qh30K", durationMinutes: 11 },
          { id: "chem-2-3", title: "Aromatic Hydrocarbons", description: "Benzene and ring structures.", youtubeUrl: "https://youtu.be/_YyjjtUvXg8?si=FT0cUpdo4u2Qh30K", durationMinutes: 8 },
        ],
      },
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    grade: "Grade 10",
    description: "Algebra, trigonometry and problem solving.",
    chapters: [
      {
        id: "math-1",
        chapterNumber: 1,
        title: "Algebra",
        quizId: "q4",
        videos: [
          { id: "math-1-1", title: "Solving Linear Equations", description: "Step-by-step solving of linear equations.", youtubeUrl: "", durationMinutes: 10 },
          { id: "math-1-2", title: "Quadratic Equations", description: "Factorisation and the quadratic formula.", youtubeUrl: "", durationMinutes: 12 },
          { id: "math-1-3", title: "Slope of a Line", description: "Understanding y = mx + c.", youtubeUrl: "", durationMinutes: 8 },
        ],
      },
      {
        id: "math-2",
        chapterNumber: 2,
        title: "Trigonometry",
        videos: [
          { id: "math-2-1", title: "Trigonometric Ratios", description: "Sine, cosine and tangent.", youtubeUrl: "", durationMinutes: 11 },
          { id: "math-2-2", title: "Solving Right Triangles", description: "Finding missing sides and angles.", youtubeUrl: "", durationMinutes: 10 },
        ],
      },
    ],
  },
];

export function getSubjectById(id: string): Subject | undefined {
  return mockSubjects.find((s) => s.id === id);
}

export function getChapter(subject: Subject, chapterNumber: number): Chapter | undefined {
  return subject.chapters.find((c) => c.chapterNumber === chapterNumber);
}

// Accepts watch?v=, youtu.be/ and /embed/ links. Returns null if empty/invalid.
export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
  } catch {
    return null;
  }
}

// --- Mock "watched" persistence using localStorage until real backend exists ---
const WATCHED_KEY = "video-watched";

export function getWatchedVideoIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setVideoWatched(videoId: string, watched: boolean) {
  if (typeof window === "undefined") return;
  const current = getWatchedVideoIds();
  const next = watched
    ? Array.from(new Set([...current, videoId]))
    : current.filter((id) => id !== videoId);
  localStorage.setItem(WATCHED_KEY, JSON.stringify(next));
}

// --- Progress helpers (progress = watched videos / total videos) ---
export interface Progress {
  done: number;
  total: number;
  percent: number;
}

function toProgress(done: number, total: number): Progress {
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function getChapterProgress(chapter: Chapter, watchedIds: string[]): Progress {
  const done = chapter.videos.filter((v) => watchedIds.includes(v.id)).length;
  return toProgress(done, chapter.videos.length);
}

export function getSubjectProgress(subject: Subject, watchedIds: string[]): Progress {
  const allVideos = subject.chapters.flatMap((c) => c.videos);
  const done = allVideos.filter((v) => watchedIds.includes(v.id)).length;
  return toProgress(done, allVideos.length);
}

export function getAllSubjects():
  | { success: true; data: Subject[] }
  | { success: false; error: string } {
  return { success: true, data: mockSubjects };
}