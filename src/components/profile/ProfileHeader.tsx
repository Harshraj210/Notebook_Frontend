import React, { useState, useEffect } from 'react';
import { Edit2, Check } from 'lucide-react';

type Props = {
  name: string;
  tagline: string;
  onUpdate: (name: string, tagline: string) => void;
};

const ProfileHeader = ({ name, tagline, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempTagline, setTempTagline] = useState(tagline);

  // Sync state if props change (external update)
  useEffect(() => {
    setTempName(name);
    setTempTagline(tagline);
  }, [name, tagline]);

  const handleSave = () => {
    onUpdate(tempName, tempTagline);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start justify-between group">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2 max-w-md">
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-zinc-800/50 text-3xl font-bold text-white px-2 py-1 rounded-md outline-none border border-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                placeholder="Your Name"
                autoFocus
              />
              <input
                value={tempTagline}
                onChange={(e) => setTempTagline(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-zinc-800/50 text-lg text-zinc-400 px-2 py-1 rounded-md outline-none border border-zinc-700 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                placeholder="Add a tagline..."
              />
              <button
                onClick={handleSave}
                className="self-start mt-2 flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition-colors"
              >
                <Check size={12} /> Save Changes
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer group/text"
            >
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                {name}
                <Edit2 size={16} className="text-zinc-600 opacity-0 group-hover/text:opacity-100 transition-opacity" />
              </h1>
              <p className="text-lg text-zinc-400 mt-1 flex items-center gap-2">
                 {tagline || "Add a tagline..."}
              </p>
            </div>
          )}
        </div>
        
        {!isEditing && (
            <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-black/20">
              {name.charAt(0).toUpperCase()}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
