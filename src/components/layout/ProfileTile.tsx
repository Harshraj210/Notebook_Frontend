"use client";

import React from 'react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, LogOut, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useNotebookStore } from '@/store/useNotebookStore';
import { cn } from '@/lib/utils';

const ProfileTile = () => {
    const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useNotebookStore();
    const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2.5 w-full p-1.5 hover:bg-zinc-800/80 rounded-lg transition-all duration-200 outline-none text-left border border-transparent hover:border-zinc-700/50 group">
                    <div className="w-7 h-7 rounded-sm bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm shrink-0">
                        P
                    </div>
                    <div className="flex-1 overflow-hidden transition-all duration-300">
                        <div className="text-xs font-semibold text-zinc-200 truncate whitespace-nowrap leading-tight max-w-[120px]">
                            Hi, John
                        </div>
                    </div>
                    <ChevronDown size={12} className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    side="right"
                    align="start"
                    sideOffset={12}
                    className={cn(
                        "w-64 bg-[#1a1a1a] border border-zinc-800 rounded-lg shadow-2xl p-1.5 z-100 outline-none",
                        "animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200"
                    )}
                >
                    {/* Top Section: Identity */}
                    <div className="px-2 py-2 mb-1 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-zinc-100">
                                {activeWorkspace?.name || "Personal"}
                            </span>
                        </div>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-zinc-800/60 my-1.5 mx-1" />

                    {/* Action Section */}
                    <DropdownMenu.Item className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 rounded cursor-pointer outline-none transition-colors">
                        <LayoutDashboard size={14} /> Dashboard
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded cursor-pointer outline-none transition-colors">
                        <LogOut size={14} /> Log out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default ProfileTile;
