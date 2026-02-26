"use client";

import React, { useState } from 'react';
import TopicNode from './TopicNode';
import { Topic } from '@/data/mockProfileData';
import { useProfileStore } from '@/store/useProfileStore';
import { Plus } from 'lucide-react';

type Props = {
  topics: Topic[];
};

const TopicTree = ({ topics }: Props) => {
  const { addTopic } = useProfileStore();
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  const handleAddTopic = () => {
    const trimmed = newTopicName.trim();
    if (!trimmed) return;
    addTopic(trimmed);
    setNewTopicName('');
    setAddingTopic(false);
  };

  return (
    <div className="mb-8 p-5 bg-[#1a1a1a] border border-zinc-800/60 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          Learning Path
        </h3>
        <button
          onClick={() => setAddingTopic(true)}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded-md hover:bg-indigo-500/10"
        >
          <Plus size={12} />
          Add topic
        </button>
      </div>

      {/* Topic list */}
      <div className="space-y-1">
        {topics.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-6">
            No topics yet. Add your first topic →
          </p>
        )}
        {topics.map((topic) => (
          <TopicNode key={topic.id} topic={topic} />
        ))}
      </div>

      {/* Add topic inline form */}
      {addingTopic && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
          <input
            autoFocus
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTopic();
              if (e.key === 'Escape') setAddingTopic(false);
            }}
            onBlur={() => {
              if (!newTopicName.trim()) setAddingTopic(false);
            }}
            placeholder="Topic name (e.g. DSA, Frontend...)"
            className="flex-1 bg-zinc-800/60 text-sm text-zinc-200 placeholder:text-zinc-600 rounded-md px-3 py-2 outline-none border border-zinc-700 focus:border-indigo-500/50 transition-all"
          />
          <button
            onClick={handleAddTopic}
            className="text-xs px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicTree;
