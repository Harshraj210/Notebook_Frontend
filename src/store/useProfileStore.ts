import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, Subtopic, defaultTopics, defaultActivity } from '@/data/mockProfileData';

interface ProfileStore {
  topics: Topic[];
  activity: Record<string, number>;

  // Topic actions
  addTopic: (name: string, icon?: string) => void;
  removeTopic: (topicId: string) => void;
  addSubtopic: (topicId: string, name: string) => void;
  removeSubtopic: (topicId: string, subtopicId: string) => void;
  updateSubtopicMastery: (topicId: string, subtopicId: string, mastery: number) => void;

  // Activity
  logActivity: (date: string, count: number) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      topics: defaultTopics,
      activity: defaultActivity,

      addTopic: (name, icon) =>
        set((state) => ({
          topics: [
            ...state.topics,
            {
              id: `t-${Date.now()}`,
              name,
              icon: icon ?? '📚',
              subtopics: [],
            },
          ],
        })),

      removeTopic: (topicId) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== topicId),
        })),

      addSubtopic: (topicId, name) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subtopics: [
                    ...t.subtopics,
                    { id: `s-${Date.now()}`, name, mastery: 1 },
                  ],
                }
              : t
          ),
        })),

      removeSubtopic: (topicId, subtopicId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? { ...t, subtopics: t.subtopics.filter((s) => s.id !== subtopicId) }
              : t
          ),
        })),

      updateSubtopicMastery: (topicId, subtopicId, mastery) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  subtopics: t.subtopics.map((s) =>
                    s.id === subtopicId ? { ...s, mastery } : s
                  ),
                }
              : t
          ),
        })),

      logActivity: (date, count) =>
        set((state) => ({
          activity: { ...state.activity, [date]: count },
        })),
    }),
    {
      name: 'notebook-profile-storage',
    }
  )
);
