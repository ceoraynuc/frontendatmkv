"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";
import { mockQuizzes, getQuizAttempt, QuizAttempt } from "../../../lib/mockQuizzes";

export default function QuizzesPage() {
  const [attempts, setAttempts] = useState<Record<string, QuizAttempt | null>>({});

  useEffect(() => {
    const result: Record<string, QuizAttempt | null> = {};
    mockQuizzes.forEach((q) => {
      result[q.id] = getQuizAttempt(q.id);
    });
    setAttempts(result);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileQuestion size={24} className="text-primary-700 dark:text-primary-350" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Quizzes</h1>
      </div>

      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] divide-y divide-gray-100 dark:divide-white/[0.06]">
        {mockQuizzes.map((q) => {
          const attempt = attempts[q.id];
          const isCompleted = !!attempt;

          return (
            <Link
              key={q.id}
              href={`/dashboard/quizzes/${q.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{q.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{q.subject}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isCompleted
                        ? "bg-primary-50 dark:bg-primary-350/10 text-primary-700 dark:text-primary-350"
                        : "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400"
                    }`}
                  >
                    {isCompleted ? "Completed" : "Not Attempted"}
                  </span>
                  {attempt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {attempt.score}/{attempt.total}
                    </p>
                  )}
                </div>
                <ArrowRight size={16} className="text-gray-300 dark:text-gray-600" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}