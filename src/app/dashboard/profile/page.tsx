"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Pencil,
  Phone,
  PlayCircle,
  School,
  TrendingUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import { CurrentUserAvatar } from "@/app/components/Avatar";
import {
  getSubjectById,
  getSubjectProgress,
  getWatchedVideoIds,
  type Subject,
} from "@/lib/mockCourses";
import {
  getProfileStats,
  getUserProfile,
  type ProfileStats,
  type UserProfile,
} from "@/lib/mockUser";

const card =
  "bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5";

function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/[0.08]"
    >
      <div
        className="h-2 rounded-full bg-primary-700 dark:bg-primary-350"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className={card}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-white/[0.08] dark:text-primary-350">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

const quickLinks = [
  { href: "/dashboard/downloads", label: "Downloads", icon: Download },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      const p = getUserProfile();
      if (!p.success) return;
      const watched = getWatchedVideoIds();
      const s = getProfileStats(p.data, watched);
      setProfile(p.data);
      setWatchedIds(watched);
      if (s.success) setStats(s.data);
    };
    load();
    window.addEventListener("profile-changed", load);
    return () => window.removeEventListener("profile-changed", load);
  }, []);

  if (!profile || !stats) {
    return (
      <div
        className="mx-auto max-w-5xl space-y-6"
        aria-busy="true"
        aria-label="Loading profile"
      >
        <div className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]"
            />
          ))}
        </div>
      </div>
    );
  }

  const subjects = profile.enrolledSubjectIds
    .map((id) => getSubjectById(id))
    .filter((s): s is Subject => Boolean(s));

  const memberSince = new Date(profile.joinedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const info: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: School, label: "School", value: profile.school },
    { icon: MapPin, label: "City", value: profile.city },
    { icon: CalendarDays, label: "Member since", value: memberSince },
  ];

  return (
    <div className="mx-auto max-w-5xl animate-fade-in space-y-6">
      {/* Header */}
      <section className={`${card} flex flex-col gap-5 sm:flex-row sm:items-center`}>
        <CurrentUserAvatar name={profile.fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold text-gray-800 dark:text-gray-100">
            {profile.fullName}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Student, {profile.grade}
          </p>
        </div>
        <Link
          href="/dashboard/profile/edit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-primary-350 dark:text-gray-900"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit profile
        </Link>
      </section>

      {/* Stats */}
      <section
        aria-label="Learning stats"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          icon={Layers}
          value={String(stats.subjectsEnrolled)}
          label="Subjects enrolled"
        />
        <StatCard
          icon={Video}
          value={`${stats.videosWatched} / ${stats.totalVideos}`}
          label="Videos watched"
        />
        <StatCard
          icon={CheckCircle2}
          value={`${stats.chaptersCompleted} / ${stats.totalChapters}`}
          label="Chapters completed"
        />
        <StatCard
          icon={TrendingUp}
          value={`${stats.overallPercent}%`}
          label="Overall progress"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrolled subjects */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Enrolled subjects
          </h2>
          {subjects.length === 0 ? (
            <div className={card}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You are not enrolled in any subjects yet.
              </p>
              <Link
                href="/dashboard/subjects"
                className="mt-3 inline-block text-sm font-medium text-primary-700 dark:text-primary-350"
              >
                Browse subjects
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => {
                const progress = getSubjectProgress(subject, watchedIds);
                return (
                  <Link
                    key={subject.id}
                    href={`/dashboard/subjects/${subject.id}`}
                    aria-label={`Open ${subject.name}, ${progress.percent}% complete`}
                    className={`${card} block hover:border-primary-700 dark:hover:border-primary-350`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {subject.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {subject.grade}
                        </p>
                      </div>
                      <BookOpen
                        className="h-5 w-5 shrink-0 text-primary-700 dark:text-primary-350"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {subject.description}
                    </p>
                    <div className="mt-4">
                      <ProgressBar
                        percent={progress.percent}
                        label={`${subject.name} progress`}
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {progress.done} of {progress.total} videos watched
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Side column */}
        <div className="space-y-6">
          <section className={card}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
              Personal information
            </h2>
            <dl className="space-y-4">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="text-xs text-gray-500 dark:text-gray-400">
                      {label}
                    </dt>
                    <dd
                      className={`break-words text-sm ${
                        value
                          ? "text-gray-800 dark:text-gray-100"
                          : "italic text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {value || "Not added yet"}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className={card}>
            <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
              Continue learning
            </h2>
            {stats.nextVideo ? (
              <Link
                href={`/dashboard/subjects/${stats.nextVideo.subjectId}/${stats.nextVideo.chapterNumber}`}
                aria-label={`Continue with ${stats.nextVideo.videoTitle}`}
                className="flex items-center gap-3"
              >
                <PlayCircle
                  className="h-8 w-8 shrink-0 text-primary-700 dark:text-primary-350"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                    {stats.nextVideo.videoTitle}
                  </span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                    {stats.nextVideo.subjectName}, Chapter{" "}
                    {stats.nextVideo.chapterNumber}
                  </span>
                </span>
              </Link>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You have watched every video. Well done.
              </p>
            )}
          </section>

          <section className={`${card} !p-2`} aria-label="Quick links">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/[0.04]"
              >
                <Icon
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                <span className="flex-1">{label}</span>
                <ChevronRight
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}