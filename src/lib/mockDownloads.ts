export interface DownloadFile {
  id: string;
  name: string;
  subject: string;
  type: "Notes" | "Past Paper" | "Guess Paper";
  fileType: "pdf" | "image";
  size: string;
  url: string; // placeholder — real file URL later
}

export const mockDownloads: DownloadFile[] = [
  {
    id: "d1",
    name: "Chemical Bonding - Chapter 5 Notes",
    subject: "Chemistry",
    type: "Notes",
    fileType: "pdf",
    size: "1.2 MB",
    url: "#",
  },
  {
    id: "d2",
    name: "Federal Board Guess Paper - Physics",
    subject: "Physics",
    type: "Guess Paper",
    fileType: "pdf",
    size: "850 KB",
    url: "#",
  },
  {
    id: "d3",
    name: "Mathematics Past Paper 2024",
    subject: "Mathematics",
    type: "Past Paper",
    fileType: "pdf",
    size: "2.1 MB",
    url: "#",
  },
  {
    id: "d4",
    name: "Newton's Laws - Diagram Sheet",
    subject: "Physics",
    type: "Notes",
    fileType: "image",
    size: "540 KB",
    url: "#",
  },
  {
    id: "d5",
    name: "Organic Chemistry Guess Paper",
    subject: "Chemistry",
    type: "Guess Paper",
    fileType: "pdf",
    size: "980 KB",
    url: "#",
  },
];