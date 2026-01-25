import React from 'react';
import TopicNode from './TopicNode';
import { Topic } from '@/data/mockProfileData';

type Props = {
  topics: Topic[];
};

const TopicTree = ({ topics }: Props) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-sm font-semibold text-zinc-300">Learning Path</h3>

      </div>
      {topics.map((topic) => (
        <TopicNode key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

export default TopicTree;
