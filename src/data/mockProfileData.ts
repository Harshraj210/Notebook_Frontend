export type Topic = {
  id: string;
  title: string;
  rating: number; // 0-5
  lastReviewed: string;
  icon?: string;
  children?: Topic[];
};

export type ProfileState = {
  name: string;
  tagline: string;
  activity: Record<string, number>; // date "YYYY-MM-DD" -> count
  topics: Topic[];
};

// Generate random activity for the last 365 days
const generateActivity = () => {
    const activity: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Randomize activity: 70% chance of 0, else random 1-10
        if (Math.random() > 0.6) {
             activity[dateStr] = Math.ceil(Math.random() * 8);
        }
    }
    return activity;
};

export const mockProfileData: ProfileState = {
  name: "John Doe",
  tagline: "Full Stack Developer in Training",
  activity: generateActivity(),
  topics: [
    {
      id: "1",
      title: "Frontend Development",
      rating: 4,
      lastReviewed: "2026-01-20",
      icon: "💻",
      children: [
        { id: "1-1", title: "React", rating: 5, lastReviewed: "2026-01-20" },
        { id: "1-2", title: "TypeScript", rating: 4, lastReviewed: "2026-01-18" },
        { id: "1-3", title: "Tailwind CSS", rating: 4, lastReviewed: "2026-01-15" },
        { id: "1-4", title: "Next.js", rating: 3, lastReviewed: "2026-01-10" },
      ],
    },
    {
      id: "2",
      title: "Backend Development",
      rating: 3,
      lastReviewed: "2026-01-22",
      icon: "⚙️",
      children: [
        { id: "2-1", title: "Node.js", rating: 4, lastReviewed: "2026-01-22" },
        { id: "2-2", title: "Express", rating: 3, lastReviewed: "2026-01-19" },
        { id: "2-3", title: "PostgreSQL", rating: 2, lastReviewed: "2026-01-05" },
      ],
    },
    {
      id: "3",
      title: "CS Concepts",
      rating: 2,
      lastReviewed: "2026-01-12",
      icon: "🧠",
      children: [
        { id: "3-1", title: "Data Structures", rating: 3, lastReviewed: "2026-01-12" },
        { id: "3-2", title: "Algorithms", rating: 2, lastReviewed: "2026-01-08" },
        { id: "3-3", title: "System Design", rating: 1, lastReviewed: "2025-12-25" },
      ],
    },
  ],
};
