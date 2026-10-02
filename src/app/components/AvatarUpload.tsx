"use client";
import { useRef, useState } from "react";
import { resizeImageToSquare } from "..//..//lib/mockUser";

const MAX_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  name: string;
  value: string | null;            // current avatar (data URL / URL)
  onChange: (dataUrl: string | null) => void;
}

export function AvatarUpload({ name, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // same file dobara chunne ke liye
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setError("Sirf JPG, PNG ya WebP photo chunein.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Photo ${MAX_MB}MB se chhoti honi chahiye.`);
      return;
    }
    try {
      setError("");
      const result = await resizeImageToSquare(file);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onChange(result.data);
    } catch {
      setError("Photo load nahi ho saki, doosri try karein.");
    }
  }

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-primary-700 text-2xl font-bold text-white ring-4 ring-white shadow-md dark:ring-[#0d1117]"
        aria-label="Change profile photo"
      >
        {value ? (
          <img src={value} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center">{initials}</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium opacity-0 transition group-hover:opacity-100">
          Change
        </span>
      </button>

      <div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-primary-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            Change photo
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#161b22]"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          JPG, PNG ya WebP, max {MAX_MB}MB.
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
    </div>
  );
}