import React from 'react';
import { Book, Zap, Trophy, TrendingUp } from 'lucide-react';
import { ProfileState } from '@/data/mockProfileData';

type Props = {
  profile: ProfileState;
};

const QuickStats = ({ profile }: Props) => {
  // Calculate stats from profile data
  const totalTopics = profile.topics.reduce((acc, topic) => acc + (topic.children?.length || 0), 0);
  
  // Calculate average rating across all leaf topics
  let totalRating = 0;
  let topicCount = 0;
  
  const processTopics = (topics: any[]) => {
    topics.forEach(t => {
      if (t.children && t.children.length > 0) {
        processTopics(t.children);
      } else {
        totalRating += t.rating;
        topicCount++;
      }
    });
  };
  
  processTopics(profile.topics);
  const averageMastery = topicCount > 0 ? (totalRating / topicCount).toFixed(1) : "0.0";

  // Calculate generic "streak" based on activity dates (simplified logic)
  const today = new Date();
  let streak = 0;
  // This is a rough estimation for visual purposes as requested in PRD
  // In a real app, this would need complex date math on the 'activity' map
  const activityDates = Object.keys(profile.activity).sort();
  if (activityDates.length > 0) {
      // Mock streak logic: random number between 3 and 12 for demo, or actual calc if we had continuous data
      streak = 5; 
  }

  const stats = [
    { label: "Active Topics", value: totalTopics, icon: Book, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Avg Mastery", value: averageMastery, icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Learning Streak", value: `${streak} Days`, icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Total XP", value: "1,250", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div 
            key={i} 
            className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 hover:border-zinc-700 transition-colors shadow-sm"
        >
          <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
