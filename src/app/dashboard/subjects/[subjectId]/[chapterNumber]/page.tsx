"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  CheckCircle2,
  Play,
  Video as VideoIcon,
  FileQuestion,
  FileText,
  Clock,
} from "lucide-react";
import {
  getSubjectById,
  getChapter,
  getWatchedVideoIds,
  setVideoWatched,
  getChapterProgress,
  getSubjectProgress,
  getYoutubeEmbedUrl,
} from "../../../../../lib/mockCourses";
import { getQuizAttempt, QuizAttempt } from "../../../../../lib/mockQuizzes";
import { ProgressBar } from "../../../../components/progressbar";

export default function ChapterPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const chapterNumber = Number(params.chapterNumber);
  const subject = getSubjectById(subjectId);
  const chapter = subject ? getChapter(subject, chapterNumber) : undefined;

  const [watched, setWatched] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    const ids = getWatchedVideoIds();
    setWatched(ids);
    if (chapter) {
      // Start on the first video not yet watched (or the first video if all are done)
      const start = chapter.videos.find((v) => !ids.includes(v.id)) ?? chapter.videos[0];
      setSelectedId(start ? start.id : null);
      setQuizAttempt(chapter.quizId ? getQuizAttempt(chapter.quizId) : null);
    }
  }, [chapter]);

  if (!subject || !chapter) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Chapter not found.</p>
        <Link href="/dashboard/subjects" className="mt-4 inline-block text-primary-700 dark:text-primary-350 hover:underline">
          Back to Subjects
        </Link>
      </div>
    );
  }

  const activeVideo = chapter.videos.find((v) => v.id === selectedId) ?? chapter.videos[0];
  const embedUrl = getYoutubeEmbedUrl(activeVideo.youtubeUrl);
  const isActiveWatched = watched.includes(activeVideo.id);
  const chapterProgress = getChapterProgress(chapter, watched);
  const subjectProgress = getSubjectProgress(subject, watched);

  const toggleWatched = () => {
    setVideoWatched(activeVideo.id, !isActiveWatched);
    setWatched(getWatchedVideoIds());
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <li>
            <Link href="/dashboard/subjects" className="hover:text-primary-700 dark:hover:text-primary-350 hover:underline">
              Subjects
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight size={14} /></li>
          <li>
            <Link href={`/dashboard/subjects/${subject.id}`} className="hover:text-primary-700 dark:hover:text-primary-350 hover:underline">
              {subject.name}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight size={14} /></li>
          <li className="text-gray-800 dark:text-gray-100 font-medium" aria-current="page">
            Chapter {chapter.chapterNumber}
          </li>
        </ol>
      </nav>

      {/* Header + progress */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5 space-y-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Chapter {chapter.chapterNumber}: {chapter.title}
        </h1>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">Chapter progress</span>
            <span className="text-gray-500 dark:text-gray-400">
              {chapterProgress.done}/{chapterProgress.total} videos · {chapterProgress.percent}%
            </span>
          </div>
          <ProgressBar percent={chapterProgress.percent} label={`Chapter ${chapter.chapterNumber} progress`} />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400">{subject.name} overall</span>
            <span className="text-gray-500 dark:text-gray-400">{subjectProgress.percent}%</span>
          </div>
          <ProgressBar percent={subjectProgress.percent} size="sm" label={`${subject.name} overall progress`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] overflow-hidden">
            <div className="aspect-video bg-black">
              {embedUrl ? (
                <iframe
                  key={activeVideo.id}
                  src={embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm text-center px-4">
                  <VideoIcon size={32} />
                  <p>Video link not added yet</p>
                </div>
              )}
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">{activeVideo.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeVideo.description}</p>
              </div>

              <button
                onClick={toggleWatched}
                aria-pressed={isActiveWatched}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition ${
                  isActiveWatched
                    ? "bg-primary-50 dark:bg-primary-350/10 border-primary-600 dark:border-primary-350 text-primary-700 dark:text-primary-350"
                    : "bg-primary-700 dark:bg-primary-350 border-transparent text-white dark:text-gray-900 hover:bg-primary-800 dark:hover:brightness-110"
                }`}
              >
                <CheckCircle2 size={16} />
                {isActiveWatched ? "Watched — click to undo" : "Mark as watched"}
              </button>
            </div>
          </div>
        </div>

        {/* Topics + resources */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 px-2 py-2">Topics</h2>
            <ul className="space-y-1">
              {chapter.videos.map((v, i) => {
                const isActive = v.id === activeVideo.id;
                const isWatched = watched.includes(v.id);
                return (
                  <li key={v.id}>
                    <button
                      onClick={() => setSelectedId(v.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`w-full flex items-start gap-3 text-left px-3 py-2.5 rounded-lg transition ${
                        isActive
                          ? "bg-primary-50 dark:bg-primary-350/10"
                          : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isWatched ? (
                          <CheckCircle2 size={18} className="text-primary-600 dark:text-primary-350" />
                        ) : (
                          <Play size={18} className="text-gray-400 dark:text-gray-500" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-medium ${isActive ? "text-primary-700 dark:text-primary-350" : "text-gray-800 dark:text-gray-100"}`}>
                          {i + 1}. {v.title}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <Clock size={12} />
                          {v.durationMinutes} min
                          {isWatched && <span className="ml-1">· Watched</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 px-2 py-2">Chapter resources</h2>
            <div className="space-y-1">
              {chapter.quizId ? (
                <Link
                  href={`/dashboard/quizzes/${chapter.quizId}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                    <FileQuestion size={16} className="text-primary-700 dark:text-primary-350" />
                    Take chapter quiz
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {quizAttempt ? `${quizAttempt.score}/${quizAttempt.total}` : "Not attempted"}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center justify-between px-3 py-2.5 opacity-60">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                    <FileQuestion size={16} />
                    Quiz
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Coming soon</span>
                </div>
              )}

              <Link
                href="/dashboard/downloads"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                  <FileText size={16} className="text-primary-700 dark:text-primary-350" />
                  Notes and papers
                </span>
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}