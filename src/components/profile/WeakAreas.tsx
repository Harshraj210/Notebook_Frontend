import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Topic } from '@/data/mockProfileData';
import ConfidenceStars from './ConfidenceStars';

type Props = {
  topics: Topic[];
};

const WeakAreas = ({ topics }: Props) => {
  const weakTopics: Topic[] = [];

  const findWeakTopics = (list: Topic[]) => {
    list.forEach(t => {
      if (t.children && t.children.length > 0) {
        findWeakTopics(t.children);
      } else {
        if (t.rating <= 2) {
          weakTopics.push(t);
        }
      }
    });
  };

  findWeakTopics(topics);
  const displayTopics = weakTopics.slice(0, 5); // Max 5

  if (displayTopics.length === 0) return null;

  return (
    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mt-6">
      <h3 className="text-sm font-semibold text-red-200 mb-3 flex items-center gap-2">
        <AlertCircle size={14} className="text-red-400" />
        Focus Areas
      </h3>
      <div className="space-y-2">
        {displayTopics.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between p-2 rounded bg-red-500/10 border border-transparent hover:bg-red-500/20 transition-colors cursor-pointer group">
            <span className="text-sm text-red-100 group-hover:block hidden transition-all">Review Now</span>
            <span className="text-sm text-zinc-300 group-hover:hidden transition-all">{topic.title}</span>
            <ConfidenceStars rating={topic.rating} size={12} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakAreas;
