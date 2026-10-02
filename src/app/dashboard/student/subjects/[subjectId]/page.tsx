"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { getSubjectById, getWatchedVideoIds, getChapterProgress, getSubjectProgress } from "../../../../lib/mockCourses";
import { ProgressBar } from "../../../components/progressbar";

export default function SubjectPage() {
  const params = useParams();
  const subject = getSubjectById(params.subjectId as string);
  const [watched, setWatched] = useState<string[]>([]);

  useEffect(() => {
    setWatched(getWatchedVideoIds());
  }, []);

  if (!subject) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Subject not found.</p>
        <Link href="/dashboard/subjects" className="mt-4 inline-block text-primary-700 dark:text-primary-350 hover:underline">
          Back to Subjects
        </Link>
      </div>
    );
  }

  const subjectProgress = getSubjectProgress(subject, watched);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/dashboard/subjects" className="hover:text-primary-700 dark:hover:text-primary-350 hover:underline">
              Subjects
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight size={14} /></li>
          <li className="text-gray-800 dark:text-gray-100 font-medium" aria-current="page">
            {subject.name}
          </li>
        </ol>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{subject.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{subject.description}</p>
      </div>

      {/* Subject progress */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Subject progress</span>
          <span className="text-gray-500 dark:text-gray-400">
            {subjectProgress.done}/{subjectProgress.total} videos · {subjectProgress.percent}%
          </span>
        </div>
        <ProgressBar percent={subjectProgress.percent} label={`${subject.name} overall progress`} />
      </div>

      {/* Chapters */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] divide-y divide-gray-100 dark:divide-white/[0.06]">
        {subject.chapters.map((c) => {
          const progress = getChapterProgress(c, watched);
          const isComplete = progress.total > 0 && progress.done === progress.total;
          return (
            <Link
              key={c.id}
              href={`/dashboard/subjects/${subject.id}/${c.chapterNumber}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-gray-800 flex items-center justify-center shrink-0 text-sm font-semibold text-primary-700 dark:text-primary-350">
                {c.chapterNumber}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{c.title}</p>
                  {isComplete && (
                    <CheckCircle2 size={16} className="text-primary-600 dark:text-primary-350 shrink-0" aria-label="Chapter completed" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {progress.done}/{progress.total} videos watched · {progress.percent}%
                </p>
                <ProgressBar percent={progress.percent} size="sm" label={`Chapter ${c.chapterNumber} progress`} />
              </div>

              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}