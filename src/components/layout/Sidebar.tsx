"use client";

import React from 'react';
import { useNotebookStore, NotebookItem } from '@/store/useNotebookStore';
import ProfileTile from '@/components/layout/ProfileTile';
import FolderItem from '@/components/layout/FolderItem';
import { Search, Settings, HelpCircle, Pin, Home, ChevronsLeft, ChevronsRight, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

const Sidebar = () => {
    const { workspaces, activeWorkspaceId, setActiveNoteId } = useNotebookStore();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);
    const items = activeWorkspace?.folders || [];

    // Pinned items extraction
    const getPinnedItems = (items: NotebookItem[]): NotebookItem[] => {
        let pinned: NotebookItem[] = [];
        items.forEach(item => {
            if (item.isPinned) pinned.push(item);
            if (item.children) pinned = [...pinned, ...getPinnedItems(item.children)];
        });
        return pinned;
    };

    const pinnedItems = getPinnedItems(items);

    const SidebarItem = ({ icon: Icon, label, onClick, shortcut }: { icon: any, label: string, onClick?: () => void, shortcut?: string }) => (
        <Tooltip.Provider delayDuration={400}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button
                        onClick={onClick}
                        className={cn(
                            "flex items-center gap-2 w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all duration-300 text-xs group h-9",
                            isCollapsed ? "justify-center px-0" : "px-3 py-2"
                        )}
                    >
                        <Icon size={16} className="shrink-0" />
                        <div className={cn(
                            "flex-1 flex items-center justify-between transition-all duration-300 overflow-hidden whitespace-nowrap",
                            isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
                        )}>
                            <span className="text-left font-medium">{label}</span>
                            {shortcut && <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">{shortcut}</span>}
                        </div>
                    </button>
                </Tooltip.Trigger>
                {isCollapsed && (
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="bg-zinc-800 text-zinc-100 px-3 py-1.5 rounded-md text-xs shadow-xl border border-zinc-700 animate-in fade-in zoom-in-95 duration-200 z-200"
                            side="right"
                            sideOffset={10}
                        >
                            {label}
                            <Tooltip.Arrow className="fill-zinc-800" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                )}
            </Tooltip.Root>
        </Tooltip.Provider>
    );

    return (
        <aside
            className={cn(
                "h-screen bg-brand-dark border-r border-brand-border flex flex-col font-sans select-none overflow-visible relative z-40",
                "transition-[width,transform,opacity] duration-500 ease-in-out will-change-[width]",
                isCollapsed ? "w-[64px] overflow-hidden" : "w-[260px]"
            )}
        >
            {/* Toggle Button - Standardized size and alignment */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "absolute right-4 top-4 z-50 w-8 h-9 flex items-center justify-center rounded-lg border border-zinc-800/50 bg-zinc-900/50 hover:bg-zinc-800 transition-all duration-300 text-zinc-500 hover:text-zinc-200 active:scale-95 group"
                )}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <div className="transition-transform duration-300">
                    {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
                </div>
            </button>

            {/* Header: Identity */}
            <div className="flex items-center min-h-[64px] px-4">
                <div className={cn("transition-all duration-300 overflow-hidden", isCollapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100")}>
                    <ProfileTile />
                </div>
            </div>

            {/* Sidebar Actions */}
            <div className="px-4 space-y-2 mt-2">
                <SidebarItem icon={Search} label="Quick Search" shortcut="⌘K" />
                <SidebarItem icon={Home} label="Home" onClick={() => setActiveNoteId(null)} />
            </div>

            {/* Body: Navigation & Library */}
            <div className={cn(
                "flex-1 overflow-y-auto px-2 mt-6 space-y-6 custom-scrollbar transition-all duration-300",
                isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* Creation Actions with Labels */}
                <div className="px-2 space-y-1">
                    <SidebarItem icon={File} label="File" />
                    <SidebarItem icon={Folder} label="Folder" />
                </div>

                {/* Pinned Section */}
                {pinnedItems.length > 0 && (
                    <div>
                        <div className="px-4 mb-2 flex items-center gap-2">
                            <Pin size={12} className="text-zinc-500" />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-opacity duration-200",
                                isCollapsed ? "opacity-0" : "opacity-100"
                            )}>
                                Pinned
                            </span>
                        </div>
                        {pinnedItems.map(item => (
                            <FolderItem key={`pinned-${item.id}`} item={item} level={1} />
                        ))}
                    </div>
                )}

                {/* Full Library (Recursive) */}
                <div>
                    <div className="px-4 mb-2 flex items-center justify-between">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-opacity duration-200",
                            isCollapsed ? "opacity-0" : "opacity-100"
                        )}>
                            Library
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        {items.map((item) => (
                            <FolderItem key={item.id} item={item} level={1} />
                        ))}
                        {items.length === 0 && (
                            <div className="px-4 py-8 text-center">
                                <p className="text-xs text-zinc-600 italic">No notes in this workspace</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={cn(
                "p-4 mt-auto border-t border-zinc-900 bg-brand-dark/80 backdrop-blur-md flex items-center gap-1 transition-all duration-300",
                isCollapsed ? "flex-col py-6" : "justify-start px-4"
            )}>
                <button className="p-2 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-all duration-200 group" title="Help & Support">
                    <HelpCircle size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </button>
                <button className="p-2 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-all duration-200 group" title="Settings">
                    <Settings size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
