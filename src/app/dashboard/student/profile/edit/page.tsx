"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, CheckCircle2 } from "lucide-react";
import { AvatarUpload } from "@/app/components/AvatarUpload";
import {
  getUserProfile,
  getAvatar,
  updateUserProfile,
  type UserProfile,
} from "@/lib/mockUser";
import { getAllSubjects, type Subject } from "@/lib/mockCourses";

const card =
  "bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5";

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary-700 dark:focus:border-primary-350 focus:outline-none";

const labelClass =
  "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

const GRADES = [
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("");
  const [grade, setGrade] = useState(GRADES[0]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);

  // Load current profile + subjects
  useEffect(() => {
    const p = getUserProfile();
    if (p.success) {
      setFullName(p.data.fullName);
      setEmail(p.data.email);
      setPhone(p.data.phone);
      setSchool(p.data.school);
      setCity(p.data.city);
      setGrade(p.data.grade);
      setEnrolledIds(p.data.enrolledSubjectIds);
    }
    const a = getAvatar();
    if (a.success) setAvatar(a.data);

    const subs = getAllSubjects();
    if (subs.success) setAllSubjects(subs.data);

    setLoading(false);
  }, []);

  function toggleSubject(id: string) {
    setEnrolledIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function validate(): string | null {
    if (fullName.trim().length < 2) return "Full name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (!grade) return "Please select your class/grade.";
    return null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    const result = updateUserProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      school: school.trim(),
      city: city.trim(),
      grade,
      enrolledSubjectIds: enrolledIds,
    } as Parameters<typeof updateUserProfile>[0] & { grade: string });
    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSaved(true);
    // Refresh listeners in other pages
    window.dispatchEvent(new Event("profile-changed"));
    window.dispatchEvent(new Event("avatar-changed"));

    setTimeout(() => {
      router.push("/dashboard/profile");
    }, 800);
  }

  function handleCancel() {
    router.push("/dashboard/profile");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6" aria-busy="true">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-white/[0.08]" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.08]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-350"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to profile
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Edit Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your personal information and enrolled subjects.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <section className={card}>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Profile photo
          </h2>
          <AvatarUpload name={fullName || "?"} value={avatar} onChange={setAvatar} />
        </section>

        {/* Personal info */}
        <section className={card}>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Personal information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name *
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ayesha Khan"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="school" className={labelClass}>
                School
              </label>
              <input
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Federal Board School"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="grade" className={labelClass}>
                Class / Grade *
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className={inputClass}
                required
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Enrolled subjects */}
        <section className={card}>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Enrolled subjects
          </h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Select the subjects you want to study. Your progress will be kept when you
            re-enroll.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {allSubjects.map((s) => {
              const checked = enrolledIds.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                    checked
                      ? "border-primary-700 bg-primary-50 dark:border-primary-350 dark:bg-white/[0.05]"
                      : "border-gray-200 hover:bg-gray-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSubject(s.id)}
                    className="h-4 w-4 accent-primary-700 dark:accent-primary-350"
                  />
                  <span className="flex-1">
                    <span className="block font-medium text-gray-800 dark:text-gray-100">
                      {s.name}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {s.grade}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-200 dark:hover:bg-white/[0.04] disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || saved}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 dark:bg-primary-350 dark:text-gray-900"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                {saving ? "Saving..." : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}