// ─── Types ────────────────────────────────────────────────────────────────────

export type Subtopic = {
  id: string;
  name: string;
  mastery: number; // 1–5
};

export type Topic = {
  id: string;
  name: string;
  icon?: string;
  subtopics: Subtopic[];
};

export type ProfileState = {
  name: string;
  tagline: string;
  activity: Record<string, number>; // "YYYY-MM-DD" → count
  topics: Topic[];
};

// ─── Default Seed Data ────────────────────────────────────────────────────────

export const defaultTopics: Topic[] = [
  {
    id: "1",
    name: "Frontend Development",
    icon: "💻",
    subtopics: [
      { id: "1-1", name: "React", mastery: 5 },
      { id: "1-2", name: "TypeScript", mastery: 4 },
      { id: "1-3", name: "Tailwind CSS", mastery: 4 },
      { id: "1-4", name: "Next.js", mastery: 3 },
    ],
  },
  {
    id: "2",
    name: "Backend Development",
    icon: "⚙️",
    subtopics: [
      { id: "2-1", name: "Node.js", mastery: 4 },
      { id: "2-2", name: "Express", mastery: 3 },
      { id: "2-3", name: "PostgreSQL", mastery: 2 },
    ],
  },
  {
    id: "3",
    name: "CS Concepts",
    icon: "🧠",
    subtopics: [
      { id: "3-1", name: "Data Structures", mastery: 3 },
      { id: "3-2", name: "Algorithms", mastery: 2 },
      { id: "3-3", name: "System Design", mastery: 1 },
    ],
  },
];

// ─── Seed Activity (last 365 days) ───────────────────────────────────────────

const generateActivity = (): Record<string, number> => {
  const activity: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (Math.random() > 0.6) {
      activity[key] = Math.ceil(Math.random() * 8);
    }
  }
  return activity;
};

export const defaultActivity = generateActivity();

// ─── Legacy compat (kept so existing imports don't break instantly) ──────────
export const mockProfileData: ProfileState = {
  name: "John Doe",
  tagline: "Full Stack Developer in Training",
  activity: defaultActivity,
  topics: defaultTopics,
};
