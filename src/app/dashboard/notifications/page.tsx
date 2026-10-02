import { Bell } from "lucide-react";

const notifications = [
  { text: "New quiz available: Organic Chemistry", time: "1h ago" },
  { text: "Federal Board Guess Paper Uploaded", time: "5h ago" },
  { text: "Your Chemistry quiz results are in", time: "1 day ago" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell size={24} className="text-primary-700 dark:text-primary-350" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Notifications
        </h1>
      </div>

      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] divide-y divide-gray-100 dark:divide-white/[0.06]">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No notifications yet.
          </p>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className="p-4">
              <p className="text-gray-800 dark:text-gray-100 text-sm">{n.text}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}