"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Check } from 'lucide-react';

type Props = {
  name: string;
  tagline: string;
  onUpdate: (name: string, tagline: string) => void;
};

const ProfileHeader = ({ name, tagline, onUpdate }: Props) => {
  const [editingField, setEditingField] = useState<null | 'name' | 'tagline'>(null);
  const [tempName, setTempName] = useState(name);
  const [tempTagline, setTempTagline] = useState(tagline);

  useEffect(() => {
    setTempName(name);
    setTempTagline(tagline);
  }, [name, tagline]);

  const handleSave = () => {
    onUpdate(tempName.trim() || name, tempTagline.trim());
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditingField(null);
  };

  const initials = name
    ? name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="flex items-start justify-between gap-6 mb-8">
      {/* Left: name + tagline */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        {editingField === 'name' ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="bg-zinc-800/60 text-2xl font-bold text-white px-3 py-1.5 rounded-lg outline-none border border-indigo-500/50 focus:border-indigo-500 transition-all w-full max-w-xs"
              placeholder="Your Name"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer group mb-1.5"
            onClick={() => setEditingField('name')}
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {name || 'Your Name'}
            </h1>
            <Edit2
              size={14}
              className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}

        {/* Tagline */}
        {editingField === 'tagline' ? (
          <div className="flex items-center gap-2">
            <input
              value={tempTagline}
              onChange={(e) => setTempTagline(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="bg-zinc-800/60 text-sm text-zinc-300 px-3 py-1.5 rounded-lg outline-none border border-zinc-700 focus:border-indigo-500/50 transition-all w-full max-w-sm"
              placeholder="Add a tagline..."
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setEditingField('tagline')}
          >
            <p className="text-sm text-zinc-400">
              {tagline || 'Add a tagline...'}
            </p>
            <Edit2
              size={12}
              className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>

      {/* Right: Avatar */}
      <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-2 ring-indigo-500/20">
        {initials}
      </div>
    </div>
  );
};

export default ProfileHeader;
