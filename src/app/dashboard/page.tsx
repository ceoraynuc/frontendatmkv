"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Flame,
  BookOpen,
  FileQuestion,
  Clock,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { getUserProfile, getProfileStats, type UserProfile, type ProfileStats } from "@/lib/mockUser";
import {
  getSubjectById,
  getSubjectProgress,
  getWatchedVideoIds,
  type Subject,
} from "@/lib/mockCourses";

const card =
  "bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5";

// Dashboard-only mock data (not part of the user profile)
const recentActivity = [
  { text: "Completed Quiz: Chemical Bonding", time: "2 hours ago" },
  { text: "Watched: Newton's Laws of Motion", time: "Yesterday" },
  { text: "Downloaded: Federal Board Guess Paper - Physics", time: "2 days ago" },
];

const upcomingQuizzes = [
  { title: "Organic Chemistry Basics", date: "Sep 5" },
  { title: "Algebra - Chapter 4", date: "Sep 7" },
];

const MOCK_STREAK = 5; // replace with real streak tracking later

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      const p = getUserProfile();
      if (!p.success) return;
      const watched = getWatchedVideoIds();
      const s = getProfileStats(p.data, watched);
      const subs = p.data.enrolledSubjectIds
        .map((id) => getSubjectById(id))
        .filter((x): x is Subject => Boolean(x));

      setProfile(p.data);
      setWatchedIds(watched);
      setSubjects(subs);
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
      <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
        <div className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]" />
      </div>
    );
  }

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your learning.
        </p>
      </div>

      {/* Continue learning — primary CTA */}
      {stats.nextVideo && (
        <Link
          href={`/dashboard/subjects/${stats.nextVideo.subjectId}/${stats.nextVideo.chapterNumber}`}
          className={`${card} flex items-center gap-4 hover:border-primary-700 dark:hover:border-primary-350`}
        >
          <PlayCircle
            className="h-10 w-10 shrink-0 text-primary-700 dark:text-primary-350"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-700 dark:text-primary-350">
              Continue learning
            </p>
            <p className="truncate text-base font-semibold text-gray-800 dark:text-gray-100">
              {stats.nextVideo.videoTitle}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {stats.nextVideo.subjectName}, Chapter {stats.nextVideo.chapterNumber}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={`${card} flex items-center gap-3`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-white/[0.08]">
            <TrendingUp size={20} className="text-primary-700 dark:text-primary-350" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
            <p className="text-xl font-bold text-primary-700 dark:text-primary-350">
              {stats.overallPercent}%
            </p>
          </div>
        </div>

        <div className={`${card} flex items-center gap-3`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-white/[0.08]">
            <Flame size={20} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Learning Streak</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {MOCK_STREAK} days
            </p>
          </div>
        </div>

        <div className={`${card} flex items-center gap-3`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-white/[0.08]">
            <BookOpen size={20} className="text-primary-700 dark:text-primary-350" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled Subjects</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {subjects.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Subjects */}
        <div className={`lg:col-span-2 ${card}`}>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary-700 dark:text-primary-350" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Your Subjects</h2>
          </div>
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You are not enrolled in any subjects yet.{" "}
              <Link
                href="/dashboard/subjects"
                className="font-medium text-primary-700 dark:text-primary-350"
              >
                Browse subjects
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {subjects.map((s) => {
                const progress = getSubjectProgress(s, watchedIds);
                return (
                  <Link
                    key={s.id}
                    href={`/dashboard/subjects/${s.id}`}
                    className="block rounded-lg p-2 -m-2 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                  >
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {s.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {progress.done}/{progress.total} videos
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-primary-700 dark:bg-primary-350"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming quizzes */}
        <div className={card}>
          <div className="mb-4 flex items-center gap-2">
            <FileQuestion size={18} className="text-primary-700 dark:text-primary-350" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Upcoming Quizzes</h2>
          </div>
          {upcomingQuizzes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming quizzes.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingQuizzes.map((q) => (
                <li key={q.title} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{q.title}</span>
                  <span className="text-gray-400 dark:text-gray-500">{q.date}</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/dashboard/quizzes"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-700 dark:text-primary-350"
          >
            View all quizzes
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className={card}>
        <div className="mb-4 flex items-center gap-2">
          <Clock size={18} className="text-primary-700 dark:text-primary-350" />
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
        </div>
        <ul className="space-y-3">
          {recentActivity.map((a, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{a.text}</span>
              <span className="text-gray-400 dark:text-gray-500">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}