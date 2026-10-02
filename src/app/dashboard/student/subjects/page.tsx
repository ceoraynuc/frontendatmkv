"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { mockSubjects, getWatchedVideoIds, getSubjectProgress } from "../../../lib/mockCourses";
import { ProgressBar } from "../../components/progressbar";

export default function SubjectsPage() {
  const [watched, setWatched] = useState<string[]>([]);

  useEffect(() => {
    setWatched(getWatchedVideoIds());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={24} className="text-primary-700 dark:text-primary-350" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Subjects
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSubjects.map((s) => {
          const progress = getSubjectProgress(s, watched);
          return (
            <Link
              key={s.id}
              href={`/dashboard/subjects/${s.id}`}
              className="block bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5 hover:shadow-md dark:hover:border-white/[0.15] transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">{s.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.grade}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
              </div>

              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {s.chapters.length} chapters · {progress.total} videos
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    {progress.done}/{progress.total} watched
                  </span>
                  <span className="font-medium text-primary-700 dark:text-primary-350">
                    {progress.percent}%
                  </span>
                </div>
                <ProgressBar percent={progress.percent} label={`${s.name} progress`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}