"use client";

import { useState } from "react";
import { Download, FileText, Image as ImageIcon, Eye, Search } from "lucide-react";
import { mockDownloads, DownloadFile } from "../../../../lib/mockDownloads";

const filters = ["All", "Notes", "Past Paper", "Guess Paper"] as const;

export default function DownloadsPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<DownloadFile | null>(null);

  const filtered = mockDownloads.filter((f) => {
    const matchesFilter = activeFilter === "All" || f.type === activeFilter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (file: DownloadFile) => {
    // Mock — real download will use file.url once Supabase Storage is wired up
    alert(`Downloading: ${file.name} (mock — no real file yet)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Download size={24} className="text-primary-700 dark:text-primary-350" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Download Center
        </h1>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/[0.08] rounded-lg px-3 py-2 sm:max-w-xs w-full">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 w-full"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                activeFilter === f
                  ? "bg-primary-900 dark:bg-primary-350 text-white dark:text-gray-900 border-primary-700 dark:border-primary-350"
                  : "bg-white dark:bg-[#161b22] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] divide-y divide-gray-100 dark:divide-white/[0.06]">
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">
            No files match your search.
          </p>
        )}
        {filtered.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                {f.fileType === "pdf" ? (
                  <FileText size={18} className="text-primary-700 dark:text-primary-350" />
                ) : (
                  <ImageIcon size={18} className="text-primary-700 dark:text-primary-350" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {f.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {f.subject} · {f.type} · {f.size}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPreviewFile(f)}
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-350 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => handleDownload(f)}
                className="flex items-center gap-1 text-sm font-medium text-primary-700 dark:text-primary-350 hover:underline px-2 py-1.5"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white dark:bg-[#161b22] rounded-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {previewFile.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {previewFile.subject} · {previewFile.type} · {previewFile.size}
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm text-center px-4">
              File preview will render here once real files are uploaded to Supabase Storage
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(previewFile)}
                className="px-4 py-2 text-sm rounded-lg bg-primary-700 dark:bg-primary-350 text-white dark:text-gray-900 hover:bg-primary-800 dark:hover:brightness-110"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}