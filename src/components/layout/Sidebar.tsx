"use client";

import React from 'react';
import { useNotebookStore, NotebookItem } from '@/store/useNotebookStore';
import ProfileTile from '@/components/layout/ProfileTile';
import FolderItem from '@/components/layout/FolderItem';
import { Search, Settings, HelpCircle, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const { workspaces, activeWorkspaceId } = useNotebookStore();

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

    return (
        <aside className="w-[260px] h-screen bg-brand-dark border-r border-brand-border flex flex-col font-sans select-none">
            {/* Header: Identity */}
            <ProfileTile />

            {/* Search Trigger */}
            <div className="px-4 mb-6">
                <button className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors text-xs">
                    <Search size={14} />
                    <span className="flex-1 text-left">Quick Search</span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">⌘K</span>
                </button>
            </div>

            {/* Body: Navigation & Library */}
            <div className="flex-1 overflow-y-auto px-2 space-y-6 custom-scrollbar">

                {/* Pinned Section */}
                {pinnedItems.length > 0 && (
                    <div>
                        <div className="px-4 mb-2 flex items-center gap-2">
                            <Pin size={12} className="text-zinc-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pinned</span>
                        </div>
                        {pinnedItems.map(item => (
                            <FolderItem key={`pinned-${item.id}`} item={item} level={1} />
                        ))}
                    </div>
                )}

                {/* Full Library (Recursive) */}
                <div>
                    <div className="px-4 mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Library</span>
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

            {/* Footer: Lean Utility */}
            <div className="p-4 mt-auto border-t border-zinc-900 bg-brand-dark/80 backdrop-blur-md flex items-center justify-end gap-1">
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
