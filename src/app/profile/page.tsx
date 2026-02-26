"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import QuickStats from '@/components/profile/QuickStats';
import CodePulseHeatmap from '@/components/profile/CodePulseHeatmap';
import TopicTree from '@/components/profile/TopicTree';
import WeakAreas from '@/components/profile/WeakAreas';
import { useUserStore } from '@/store/useUserStore';
import { useProfileStore } from '@/store/useProfileStore';

export default function ProfilePage() {
  const { name, tagline, updateProfile } = useUserStore();
  const { topics, activity } = useProfileStore();

  const handleUpdateProfile = (newName: string, newTagline: string) => {
    updateProfile({ name: newName, tagline: newTagline });
  };

  return (
    <div className="min-h-screen bg-[#111] text-zinc-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {/* Back arrow */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Back</span>
          </Link>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          name={name}
          tagline={tagline}
          onUpdate={handleUpdateProfile}
        />

        {/* Stats Cards */}
        <QuickStats topics={topics} activity={activity} />

        {/* Activity Heatmap */}
        <CodePulseHeatmap data={activity} />

        {/* Learning Path + Weak Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topics tree: takes 2/3 */}
          <div className="lg:col-span-2">
            <TopicTree topics={topics} />
          </div>

          {/* Weak Areas: takes 1/3 */}
          <div className="lg:col-span-1">
            <WeakAreas topics={topics} />
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-16" />
      </div>
    </div>
  );
}
