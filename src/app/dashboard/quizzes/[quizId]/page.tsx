"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { getQuizById, saveQuizAttempt } from "../../../../lib/mockQuizzes";

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const quiz = getQuizById(quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(() => (quiz ? quiz.durationMinutes * 60 : 0));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || !quiz) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, quiz]);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Quiz not found.</p>
        <button
          onClick={() => router.push("/dashboard/quizzes")}
          className="mt-4 text-primary-700 dark:text-primary-350 hover:underline"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const finishQuiz = () => {
    const score = quiz.questions.reduce(
      (acc, q) => acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    saveQuizAttempt(quiz.id, {
      score,
      total: totalQuestions,
      completedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishQuiz();
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(quiz.durationMinutes * 60);
    setSubmitted(false);
  };

  // ---- Results view ----
  if (submitted) {
    const score = quiz.questions.reduce(
      (acc, q) => acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-6 text-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {quiz.title} — Results
          </h1>
          <p className="text-4xl font-bold text-primary-700 dark:text-primary-350 my-4">
            {score} / {totalQuestions}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {score === totalQuestions
              ? "Perfect score!"
              : score >= totalQuestions / 2
              ? "Good effort — review the explanations below."
              : "Keep practicing — review the explanations below."}
          </p>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, i) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5"
              >
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle2 size={20} className="text-primary-600 dark:text-primary-350 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                  )}
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {i + 1}. {q.question}
                  </p>
                </div>
                <div className="ml-7 space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    Your answer:{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-primary-700 dark:text-primary-350 font-medium"
                          : "text-red-600 dark:text-red-400 font-medium"
                      }
                    >
                      {userAnswer !== undefined ? q.options[userAnswer] : "Not answered"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Correct answer:{" "}
                      <span className="text-primary-700 dark:text-primary-350 font-medium">
                        {q.options[q.correctIndex]}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 bg-primary-700 dark:bg-primary-350 text-white dark:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-primary-800 dark:hover:brightness-110 transition"
          >
            <RotateCcw size={16} />
            Retry Quiz
          </button>
          <button
            onClick={() => router.push("/dashboard/quizzes")}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // ---- Quiz-taking view ----
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-4">
        <div>
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">{quiz.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 font-medium">
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 dark:bg-primary-350 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-6">
        <p className="font-medium text-gray-800 dark:text-gray-100 mb-4">
          {question.question}
        </p>
        <div className="space-y-2">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswers[question.id] === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                  isSelected
                    ? "border-primary-600 dark:border-primary-350 bg-primary-50 dark:bg-primary-350/10 text-primary-700 dark:text-primary-350"
                    : "border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedAnswers[question.id] === undefined}
          className="bg-primary-700 dark:bg-primary-350 text-white dark:text-gray-900 font-medium px-6 py-2 rounded-lg hover:bg-primary-800 dark:hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentIndex < totalQuestions - 1 ? "Next" : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}