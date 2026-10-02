"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Video,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  getUserProfile,
  getProfileStats,
  type UserProfile,
  type ProfileStats,
} from "@/lib/mockUser";
import {
  getSubjectById,
  getSubjectProgress,
  getWatchedVideoIds,
  type Subject,
} from "@/lib/mockCourses";

const card =
  "bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5";

// Dashboard-only mock: weekly study hours (not tracked yet)
const weeklyHours = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2 },
  { day: "Wed", hours: 0.5 },
  { day: "Thu", hours: 3 },
  { day: "Fri", hours: 1 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 1 },
];

interface SubjectProgress {
  subject: Subject;
  done: number;
  total: number;
  percent: number;
}

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);

  useEffect(() => {
    const load = () => {
      const p = getUserProfile();
      if (!p.success) return;
      const watched = getWatchedVideoIds();
      const s = getProfileStats(p.data, watched);
      const subs: SubjectProgress[] = p.data.enrolledSubjectIds
        .map((id) => getSubjectById(id))
        .filter((x): x is Subject => Boolean(x))
        .map((sub) => {
          const prog = getSubjectProgress(sub, watched);
          return {
            subject: sub,
            done: prog.done,
            total: prog.total,
            percent: prog.percent,
          };
        });

      setProfile(p.data);
      setSubjectProgress(subs);
      if (s.success) setStats(s.data);
    };
    load();
    window.addEventListener("profile-changed", load);
    window.addEventListener("progress-changed", load);
    return () => {
      window.removeEventListener("profile-changed", load);
      window.removeEventListener("progress-changed", load);
    };
  }, []);

  if (!profile || !stats) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading progress">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-white/[0.08]" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]" />
      </div>
    );
  }

  const maxHours = Math.max(...weeklyHours.map((h) => h.hours), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 size={24} className="text-primary-700 dark:text-primary-350" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Your Progress
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track how far you&apos;ve come across all subjects.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className={card}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-white/[0.08] dark:text-primary-350">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.overallPercent}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overall progress</p>
        </div>

        <div className={card}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-white/[0.08] dark:text-primary-350">
            <Video className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.videosWatched} / {stats.totalVideos}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Videos watched</p>
        </div>

        <div className={card}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-white/[0.08] dark:text-primary-350">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.chaptersCompleted} / {stats.totalChapters}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chapters completed
          </p>
        </div>

        <div className={card}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-white/[0.08] dark:text-primary-350">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.subjectsEnrolled}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Subjects enrolled
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Per-subject progress */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Progress by subject
          </h2>

          {subjectProgress.length === 0 ? (
            <div className={card}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You are not enrolled in any subjects yet.{" "}
                <Link
                  href="/dashboard/subjects"
                  className="font-medium text-primary-700 dark:text-primary-350"
                >
                  Browse subjects
                </Link>
              </p>
            </div>
          ) : (
            <div className={`${card} space-y-5`}>
              {subjectProgress.map(({ subject, done, total, percent }) => (
                <Link
                  key={subject.id}
                  href={`/dashboard/subjects/${subject.id}`}
                  className="block rounded-lg p-2 -m-2 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                  aria-label={`${subject.name}, ${percent}% complete`}
                >
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {subject.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {done}/{total} videos · {percent}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${subject.name} progress`}
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <div
                      className="h-full rounded-full bg-primary-700 dark:bg-primary-350"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Weekly study hours — mock */}
        <section className={card}>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            This week
          </h2>
          <div className="flex h-40 items-end justify-between gap-2">
            {weeklyHours.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {d.hours}h
                </span>
                <div
                  className="w-full rounded-t-md bg-primary-700 dark:bg-primary-350"
                  style={{ height: `${(d.hours / maxHours) * 100}%` }}
                  aria-label={`${d.day}: ${d.hours} hours`}
                />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Total: {weeklyHours.reduce((a, b) => a + b.hours, 0).toFixed(1)} hours
          </p>
        </section>
      </div>

      {/* Continue learning */}
      {stats.nextVideo && (
        <Link
          href={`/dashboard/subjects/${stats.nextVideo.subjectId}/${stats.nextVideo.chapterNumber}`}
          className={`${card} flex items-center gap-4 hover:border-primary-700 dark:hover:border-primary-350`}
        >
          <TrendingUp
            className="h-8 w-8 shrink-0 text-primary-700 dark:text-primary-350"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-700 dark:text-primary-350">
              Keep going
            </p>
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
              {stats.nextVideo.videoTitle}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {stats.nextVideo.subjectName}, Chapter {stats.nextVideo.chapterNumber}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}