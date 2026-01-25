import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Topic } from '@/data/mockProfileData';
import ConfidenceStars from './ConfidenceStars';

type Props = {
  topic: Topic;
  level?: number;
};

const TopicNode = ({ topic, level = 0 }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = topic.children && topic.children.length > 0;

  // Calculate parent rating if children exist
  const displayRating = hasChildren
    ? Math.round(topic.children!.reduce((acc, t) => acc + t.rating, 0) / topic.children!.length)
    : topic.rating;

  return (
    <div className="select-none">
      <div 
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group cursor-pointer border border-transparent",
          isOpen ? "bg-zinc-800/30 border-zinc-800/50" : "hover:bg-zinc-800/50",
          level > 0 && "ml-4" // Indentation for children
        )}
      >
        <div className={cn("text-zinc-500 transition-transform duration-200", isOpen && "rotate-90")}>
          {hasChildren ? <ChevronRight size={14} /> : <div className="w-3.5" />}
        </div>
        
        <div className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center text-lg shadow-sm border border-zinc-800 transition-colors",
            hasChildren ? "bg-zinc-800 text-indigo-400" : "bg-zinc-900 text-zinc-400"
        )}>
           {topic.icon ? topic.icon : hasChildren ? <Folder size={14}/> : <FileText size={14}/>}
        </div>

        <div className="flex-1">
            <h4 className={cn("text-sm font-medium transition-colors", hasChildren ? "text-zinc-200" : "text-zinc-400")}>
                {topic.title}
            </h4>
        </div>

        <ConfidenceStars rating={displayRating} />
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1 flex flex-col gap-0.5 border-l border-zinc-800 ml-6 pl-2 animate-in slide-in-from-top-2 duration-200 fade-in">
          {topic.children!.map((child) => (
            <TopicNode key={child.id} topic={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicNode;
