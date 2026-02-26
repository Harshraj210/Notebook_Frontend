"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Topic } from '@/data/mockProfileData';
import ConfidenceStars from './ConfidenceStars';

type Props = {
  topics: Topic[];
};

const WeakAreas = ({ topics }: Props) => {
  type WeakItem = { name: string; mastery: number };
  const weakItems: WeakItem[] = [];

  topics.forEach((t) => {
    t.subtopics.forEach((s) => {
      if (s.mastery <= 2) {
        weakItems.push({ name: s.name, mastery: s.mastery });
      }
    });
  });

  const display = weakItems.slice(0, 5);

  if (display.length === 0) {
    return (
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
        <p className="text-xs text-emerald-400 font-medium">🎉 No weak areas!</p>
        <p className="text-[11px] text-zinc-500 mt-1">All subtopics mastery is above 2.</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#1a1a1a] border border-zinc-800/60 rounded-xl">
      <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 mb-4">
        <AlertCircle size={14} className="text-red-400" />
        Focus Areas
      </h3>
      <div className="space-y-2">
        {display.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-sm text-zinc-300">{item.name}</span>
            <ConfidenceStars rating={item.mastery} size={12} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakAreas;
