import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ProfileState } from '@/data/mockProfileData';
import * as Tooltip from '@radix-ui/react-tooltip';

type Props = {
  data: ProfileState['activity'];
};

const CodePulseHeatmap = ({ data }: Props) => {
  // Generate last 365 days grouped by weeks
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 365);
    
    // Align start date to the previous Sunday
    const dayOfWeek = startDate.getDay();
    const alignedStartDate = new Date(startDate);
    alignedStartDate.setDate(startDate.getDate() - dayOfWeek);

    const result: Date[][] = [];
    let currentWeek: Date[] = [];
    let currentDate = new Date(alignedStartDate);

    // Loop until we cover everything up to today
    while (currentDate <= today || currentWeek.length > 0) {
      currentWeek.push(new Date(currentDate));
      
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
        if (currentDate > today) break;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }, []);

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-zinc-900/50";
    if (count <= 2) return "bg-blue-900/60";
    if (count <= 4) return "bg-blue-600";
    return "bg-blue-400";
  };
  
  const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
  };

  const getMonthLabels = () => {
    const labels: { text: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0]; 
      const month = firstDay.getMonth();
      
      if (month !== lastMonth) {
        labels.push({ 
            text: firstDay.toLocaleString('default', { month: 'short' }), 
            weekIndex 
        });
        lastMonth = month;
      }
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="mb-8 p-6 bg-[#1a1a1a] border border-zinc-800/60 rounded-xl shadow-lg border-b-2 border-b-blue-500/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"/>
            Learning Activity
        </h3>
        <span className="text-xs text-zinc-500">Last Year</span>
      </div>
      
      <div className="relative overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="flex items-start gap-1 min-w-max">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mt-[18px] mr-2">
                 <div className="h-[10px]" /> 
                 <span className="text-[10px] text-zinc-400 dark:text-zinc-600 h-[10px] leading-[10px]">Mon</span>
                 <div className="h-[10px]" /> 
                 <span className="text-[10px] text-zinc-400 dark:text-zinc-600 h-[10px] leading-[10px]">Wed</span>
                 <div className="h-[10px]" /> 
                 <span className="text-[10px] text-zinc-400 dark:text-zinc-600 h-[10px] leading-[10px]">Fri</span>
            </div>

            {/* The Grid */}
            <div className="flex flex-col gap-1">
                {/* Month Labels */}
                <div className="flex relative h-4 mb-1">
                    {monthLabels.map((bg, i) => (
                        <span 
                            key={i} 
                            className="absolute text-[10px] text-zinc-400 dark:text-zinc-500 top-0"
                            style={{ left: `${bg.weekIndex * 14}px` }} 
                        >
                            {bg.text}
                        </span>
                    ))}
                </div>

                {/* Weeks Container */}
                <div className="flex gap-[3px]">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[3px]">
                            {week.map((date, dayIndex) => {
                                const dateStr = formatDate(date);
                                const count = data[dateStr] || 0;
                                const isFuture = date > new Date();

                                return (
                                    <Tooltip.Provider key={dateStr}>
                                        <Tooltip.Root delayDuration={100}>
                                            <Tooltip.Trigger asChild>
                                                <div
                                                    className={cn(
                                                        "w-[10px] h-[10px] rounded-[2px] transition-colors duration-200",
                                                        isFuture ? "opacity-0" : getIntensityClass(count),
                                                        !isFuture && count > 0 && "hover:ring-1 hover:ring-blue-400 border border-transparent dark:border-transparent"
                                                    )}
                                                />
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content 
                                                    className="bg-zinc-800 text-xs text-zinc-200 px-2 py-1 rounded border border-zinc-700 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
                                                    sideOffset={5}
                                                >
                                                    {count === 0 ? "No activity" : `${count} activities`} on {date.toLocaleDateString()}
                                                    <Tooltip.Arrow className="fill-zinc-800" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    </Tooltip.Provider>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-2 text-[10px] text-zinc-500">
        <span>Less</span>
        <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-100 dark:bg-zinc-900/50" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-300 dark:bg-blue-900/60" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-500 dark:bg-blue-600" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-600 dark:bg-blue-400" />
        <span>More</span>
      </div>
    </div>
  );
};

export default CodePulseHeatmap;
