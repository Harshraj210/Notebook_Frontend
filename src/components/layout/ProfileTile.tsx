"use client";

import React from 'react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, LogOut, Settings, ChevronDown, LayoutDashboard, Briefcase, Plus } from 'lucide-react';
import { useNotebookStore } from '@/store/useNotebookStore';
import { cn } from '@/lib/utils';

const ProfileTile = () => {
    const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useNotebookStore();
    const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

    return (
        <div className="p-4">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-3 w-full p-2 hover:bg-zinc-900 rounded-lg transition-all duration-200 outline-none text-left border border-transparent hover:border-zinc-800">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                            {activeWorkspace?.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-semibold text-zinc-100 truncate">John Doe</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Pro Plan</div>
                        </div>
                        <ChevronDown size={14} className="text-zinc-500" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="w-64 bg-brand-dark border border-zinc-800 rounded-xl shadow-2xl p-2 z-100 animate-in fade-in zoom-in-95 duration-200"
                        sideOffset={8}
                    >
                        <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 rounded-lg cursor-pointer outline-none">
                            <LayoutDashboard size={14} /> Dashboard
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="h-px bg-zinc-800 my-2" />

                        <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer outline-none">
                            <LogOut size={14} /> Logout
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
};

export default ProfileTile;
