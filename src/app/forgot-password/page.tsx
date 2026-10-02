"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/app/components/AuthLayout";

// Mock — replace with real API once backend is ready
async function mockRequestReset(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!email.includes("@")) {
    return { success: false, error: "Please enter a valid email" };
  }
  return { success: true };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await mockRequestReset(email);

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white dark:bg-[#161b22] rounded-2xl shadow-md dark:shadow-none dark:border dark:border-white/[0.08] p-8">
        {!sent ? (
          <>
            <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-350 mb-1">
              Forgot password?
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 dark:border-white/[0.08] rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-[#0d1117] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 dark:bg-primary-350 text-white dark:text-gray-900 font-medium py-2 rounded-lg hover:bg-primary-800 dark:hover:brightness-110 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-350 mb-1">
              Check your email
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>.
              (This is a mock flow — in the real app, clicking the emailed
              link opens the reset-password page below.)
            </p>
            <Link
              href="/reset-password"
              className="inline-block mt-6 text-sm text-secondary-600 dark:text-secondary-400 hover:underline"
            >
              Simulate clicking the reset link →
            </Link>
          </>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Remembered your password?{" "}
          <Link href="/login" className="text-secondary-600 dark:text-secondary-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}