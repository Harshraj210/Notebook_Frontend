"use client";

import React, { useState } from 'react';
import { ChevronRight, Folder, FileText, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Topic } from '@/data/mockProfileData';
import ConfidenceStars from './ConfidenceStars';
import { useProfileStore } from '@/store/useProfileStore';

type Props = {
  topic: Topic;
};

const TopicNode = ({ topic }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addingSubtopic, setAddingSubtopic] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const { addSubtopic, removeTopic, removeSubtopic } = useProfileStore();

  const avgMastery =
    topic.subtopics.length > 0
      ? Math.round(
          topic.subtopics.reduce((acc, s) => acc + s.mastery, 0) / topic.subtopics.length
        )
      : 0;

  const handleAddSubtopic = () => {
    const trimmed = newSubtopicName.trim();
    if (!trimmed) return;
    addSubtopic(topic.id, trimmed);
    setNewSubtopicName('');
    setAddingSubtopic(false);
  };

  return (
    <div className="select-none">
      {/* Parent row */}
      <div
        className={cn(
          'flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 cursor-pointer border border-transparent group',
          isOpen ? 'bg-zinc-800/30 border-zinc-800/50' : 'hover:bg-zinc-800/50'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Chevron */}
        <div
          className={cn(
            'text-zinc-500 transition-transform duration-200 shrink-0',
            isOpen && 'rotate-90'
          )}
        >
          <ChevronRight size={14} />
        </div>

        {/* Icon */}
        <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg bg-zinc-800 border border-zinc-700 shrink-0">
          {topic.icon ?? <Folder size={14} className="text-indigo-400" />}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-zinc-200 truncate">{topic.name}</span>
        </div>

        {/* Avg mastery stars (condensed) */}
        <ConfidenceStars rating={avgMastery} size={12} />

        {/* Delete topic (visible on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeTopic(topic.id);
          }}
          className="ml-1 p-1 rounded text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Subtopics */}
      {isOpen && (
        <div className="ml-6 pl-3 border-l border-zinc-800 mt-1 space-y-0.5">
          {topic.subtopics.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-800/40 transition-colors group/sub"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center bg-zinc-800/50 shrink-0">
                <FileText size={11} className="text-zinc-500" />
              </div>
              <span className="flex-1 text-sm text-zinc-400 truncate">{sub.name}</span>
              <ConfidenceStars rating={sub.mastery} size={11} />
              <button
                onClick={() => removeSubtopic(topic.id, sub.id)}
                className="ml-1 p-1 rounded text-zinc-700 hover:text-red-400 opacity-0 group-hover/sub:opacity-100 transition-all"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}

          {/* Add subtopic */}
          {addingSubtopic ? (
            <div
              className="flex items-center gap-2 px-2 py-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                autoFocus
                value={newSubtopicName}
                onChange={(e) => setNewSubtopicName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtopic();
                  if (e.key === 'Escape') setAddingSubtopic(false);
                }}
                onBlur={() => {
                  if (!newSubtopicName.trim()) setAddingSubtopic(false);
                }}
                placeholder="Subtopic name..."
                className="flex-1 bg-zinc-800/60 text-xs text-zinc-200 placeholder:text-zinc-600 rounded-md px-2 py-1.5 outline-none border border-zinc-700 focus:border-indigo-500/50"
              />
              <button
                onClick={handleAddSubtopic}
                className="text-xs px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAddingSubtopic(true);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-600 hover:text-indigo-400 transition-colors"
            >
              <Plus size={11} />
              Add subtopic
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicNode;
