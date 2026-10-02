export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Chemical Bonding",
    subject: "Chemistry",
    durationMinutes: 5,
    questions: [
      {
        id: "q1-1",
        question: "What type of bond involves the sharing of electron pairs?",
        options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
        correctIndex: 1,
        explanation: "Covalent bonds form when atoms share electron pairs to achieve stability.",
      },
      {
        id: "q1-2",
        question: "Which bond forms between a metal and a non-metal?",
        options: ["Covalent", "Ionic", "Metallic", "Van der Waals"],
        correctIndex: 1,
        explanation: "Ionic bonds form through electron transfer, typically between metals and non-metals.",
      },
      {
        id: "q1-3",
        question: "What holds atoms together in a metallic bond?",
        options: [
          "Shared electron pairs",
          "Transferred electrons",
          "A sea of delocalized electrons",
          "Hydrogen bonding",
        ],
        correctIndex: 2,
        explanation: "Metallic bonds are held together by a 'sea' of delocalized electrons shared among metal cations.",
      },
    ],
  },
  {
    id: "q2",
    title: "Newton's Laws",
    subject: "Physics",
    durationMinutes: 5,
    questions: [
      {
        id: "q2-1",
        question: "Newton's First Law is also known as the law of:",
        options: ["Acceleration", "Inertia", "Action-Reaction", "Gravitation"],
        correctIndex: 1,
        explanation: "The First Law states an object stays at rest or in motion unless acted on by a force — the law of inertia.",
      },
      {
        id: "q2-2",
        question: "F = ma is an expression of Newton's:",
        options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
        correctIndex: 1,
        explanation: "The Second Law relates force, mass, and acceleration: F = ma.",
      },
      {
        id: "q2-3",
        question: "\"For every action, there is an equal and opposite reaction\" describes:",
        options: ["First Law", "Second Law", "Third Law", "None of these"],
        correctIndex: 2,
        explanation: "This is Newton's Third Law of Motion.",
      },
    ],
  },
  {
    id: "q3",
    title: "Organic Chemistry Basics",
    subject: "Chemistry",
    durationMinutes: 5,
    questions: [
      {
        id: "q3-1",
        question: "What is the general formula for alkanes?",
        options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnH2n+1"],
        correctIndex: 1,
        explanation: "Alkanes are saturated hydrocarbons with only single bonds, following the formula CnH2n+2.",
      },
      {
        id: "q3-2",
        question: "Which functional group is present in alcohols?",
        options: ["-COOH", "-OH", "-CHO", "-NH2"],
        correctIndex: 1,
        explanation: "Alcohols contain the hydroxyl (-OH) functional group.",
      },
      {
        id: "q3-3",
        question: "Benzene is an example of which type of hydrocarbon?",
        options: ["Aliphatic", "Aromatic", "Alicyclic", "Saturated"],
        correctIndex: 1,
        explanation: "Benzene has a ring structure with alternating double bonds, making it an aromatic hydrocarbon.",
      },
    ],
  },
  {
    id: "q4",
    title: "Algebra - Chapter 4",
    subject: "Mathematics",
    durationMinutes: 5,
    questions: [
      {
        id: "q4-1",
        question: "What is the solution to 2x + 4 = 10?",
        options: ["x = 2", "x = 3", "x = 4", "x = 5"],
        correctIndex: 1,
        explanation: "2x + 4 = 10 → 2x = 6 → x = 3.",
      },
      {
        id: "q4-2",
        question: "Which of these is a quadratic equation?",
        options: ["x + 5 = 0", "x² + 2x + 1 = 0", "2x = 8", "x/2 = 4"],
        correctIndex: 1,
        explanation: "A quadratic equation contains a squared term (x²) as its highest power.",
      },
      {
        id: "q4-3",
        question: "What is the slope of the line y = 3x + 2?",
        options: ["1", "2", "3", "5"],
        correctIndex: 2,
        explanation: "In y = mx + c form, m is the slope — here m = 3.",
      },
    ],
  },
];

export function getQuizById(id: string): Quiz | undefined {
  return mockQuizzes.find((q) => q.id === id);
}

// --- Mock "attempt" persistence using localStorage until real backend exists ---
export interface QuizAttempt {
  score: number;
  total: number;
  completedAt: string;
}

export function saveQuizAttempt(quizId: string, attempt: QuizAttempt) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`quiz-attempt-${quizId}`, JSON.stringify(attempt));
}

export function getQuizAttempt(quizId: string): QuizAttempt | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`quiz-attempt-${quizId}`);
  return raw ? JSON.parse(raw) : null;
}