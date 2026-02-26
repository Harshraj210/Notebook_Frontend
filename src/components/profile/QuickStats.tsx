"use client";

import React from 'react';
import { BookOpen, Trophy, Zap, TrendingUp } from 'lucide-react';
import { Topic } from '@/data/mockProfileData';

type Props = {
  topics: Topic[];
  activity: Record<string, number>;
};

const QuickStats = ({ topics, activity }: Props) => {
  // Active topics = total subtopic count
  const activeTopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);

  // Average mastery across all subtopics
  let totalMastery = 0;
  let subtopicCount = 0;
  topics.forEach((t) => {
    t.subtopics.forEach((s) => {
      totalMastery += s.mastery;
      subtopicCount++;
    });
  });
  const avgMastery = subtopicCount > 0 ? (totalMastery / subtopicCount).toFixed(1) : '0.0';

  // Learning streak — consecutive days from today going backwards
  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (activity[key] && activity[key] > 0) {
        count++;
      } else if (i > 0) {
        // Allow gap of 0 on today itself
        break;
      }
    }
    return count;
  })();

  // Total XP = sum of mastery * 100
  const totalXP = topics.reduce(
    (acc, t) => acc + t.subtopics.reduce((a, s) => a + s.mastery * 100, 0),
    0
  );

  const stats = [
    {
      label: 'Active Topics',
      value: activeTopics,
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/10',
      glow: 'shadow-blue-500/5',
    },
    {
      label: 'Avg Mastery',
      value: avgMastery,
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/10',
      glow: 'shadow-amber-500/5',
    },
    {
      label: 'Streak',
      value: `${streak}d`,
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/10',
      glow: 'shadow-purple-500/5',
    },
    {
      label: 'Total XP',
      value: totalXP.toLocaleString(),
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/10',
      glow: 'shadow-emerald-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-zinc-900/60 border ${stat.border} p-4 rounded-xl flex items-center gap-3 hover:bg-zinc-900/80 transition-all shadow-sm ${stat.glow}`}
        >
          <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color} shrink-0`}>
            <stat.icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-zinc-100 leading-none mt-0.5">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
