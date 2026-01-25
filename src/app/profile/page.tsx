"use client";

import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import QuickStats from '@/components/profile/QuickStats';
import CodePulseHeatmap from '@/components/profile/CodePulseHeatmap';
import TopicTree from '@/components/profile/TopicTree';
import WeakAreas from '@/components/profile/WeakAreas';
import { mockProfileData, ProfileState } from '@/data/mockProfileData';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState | null>(null);

  useEffect(() => {
    // Load identity from localStorage but keep fresh mock data for activity
    const saved = localStorage.getItem("profile_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile({
        ...mockProfileData,
        name: parsed.name ?? mockProfileData.name,
        tagline: parsed.tagline ?? mockProfileData.tagline,
      });
    } else {
      setProfile(mockProfileData);
    }
  }, []);

  const handleUpdateProfile = (name: string, tagline: string) => {
    if (!profile) return;
    const updated = { ...profile, name, tagline };
    setProfile(updated);
    localStorage.setItem("profile_v1", JSON.stringify(updated));
  };

  if (!profile) return <div className="p-8 text-zinc-500">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#111] text-zinc-100 p-4 md:p-8 lg:px-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader 
          name={profile.name} 
          tagline={profile.tagline} 
          onUpdate={handleUpdateProfile} 
        />
        
        <QuickStats profile={profile} />
        
        <CodePulseHeatmap data={profile.activity} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TopicTree topics={profile.topics} />
          </div>
          <div className="lg:col-span-1">
             <div className="bg-zinc-900/30 rounded-xl p-4 border border-zinc-800/50 sticky top-4">
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4">Insights</h3>
                <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
                    You're doing great! Keep focusing on <span className="text-indigo-400 font-medium">React</span> and <span className="text-indigo-400 font-medium">Node.js</span> to level up your full-stack skills.
                </p>
                <WeakAreas topics={profile.topics} />
             </div>
          </div>
        </div>

        <div className="h-20" /> {/* Spacer */}
      </div>
    </div>
  );
}
