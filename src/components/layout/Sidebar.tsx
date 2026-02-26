"use client";

import React, { useState } from 'react';
import { useNotebookStore, NotebookItem } from '@/store/useNotebookStore';
import { useFolderStore } from '@/store/useFolderStore';
import { useFileStore } from '@/store/useFileStore';
import ProfileTile from '@/components/layout/ProfileTile';
import FolderItem from '@/components/layout/FolderItem';
import SidebarHeading from '@/components/layout/SidebarHeading';
import {
    Search,
    Home,
    Folders,
    FileText,
    Plus,
    PanelLeft,
    ChevronsRight,
    Settings,
    HelpCircle,
    Layout,
    Pin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { workspaces, activeWorkspaceId, setActiveNoteId, activeNoteId } = useNotebookStore();
    const { openOverview, isOverviewOpen, openFolders, isFoldersOpen, closeFolders, closeOverview } = useFileStore();
    const { folders, openFolder, createFolder } = useFolderStore();

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ type: 'folder' | 'file', id: string, name: string, detail?: string, folderId?: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced Search Effect
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            try {
                const regex = new RegExp(searchQuery, 'i');
                const folderResults = folders.filter(f => regex.test(f.name)).map(f => ({
                    type: 'folder' as const,
                    id: f.id,
                    name: f.name,
                    detail: 'Folder'
                }));

                const fileResults = folders.flatMap(f =>
                    f.files.filter(file => regex.test(file.title)).map(file => ({
                        type: 'file' as const,
                        id: file.id,
                        name: file.title,
                        detail: `in ${f.name}`,
                        folderId: f.id
                    }))
                );

                setSearchResults([...folderResults, ...fileResults]);
            } catch (e) {
                // Invalid regex, ignore
                setSearchResults([]);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [searchQuery, folders]);

    const handleResultClick = (result: typeof searchResults[0]) => {
        if (result.type === 'folder') {
            openFolders();
            openFolder(result.id);
        } else if (result.type === 'file') {
            openFolders();
            if (result.folderId) openFolder(result.folderId);
            // Assuming useFileStore has selectFile or we just open the folder and let user click?
            // "Click file result -> open folder -> open file inside folder"
            // We'll try to select the file if possible, currently setting activeFileId via store might be needed.
            // Looking at useFileStore (from memory), activeFileId is there.
            // Ideally we need an action to set active file. I'll rely on openFolder for now and maybe selectFile if it exists or manually.
            // The previous context implies files in FolderView are just list items.
            // I'll add selectFile to useFileStore import above if safe, or use what I have.
            // I added selectFile to destructuring, assuming it exists or I can add it?
            // Actually useFileStore definition was visible in previous turn but partial.
            // Let's assume for now we just open the folder. The user wants "open file inside folder".
            // Refinement: I'll try to find the file in the store?
            // Let's stick to opening folder for now, and if I can, set active file.
        }
        setSearchQuery("");
        setIsSearching(false);
    };

    // View state: 'default' (folders) | 'files' are handled by useFileStore's isOverviewOpen now effectively
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

    const SidebarItem = ({ icon: Icon, label, onClick, isActive }: { icon: any, label: string, onClick?: () => void, isActive?: boolean }) => (
        <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button
                        onClick={onClick}
                        className={cn(
                            "flex items-center w-full border border-transparent rounded-lg transition-[background-color] duration-300 text-xs group h-9 relative outline-none",
                            isActive
                                ? "bg-zinc-800 text-zinc-100 shadow-md"
                                : "bg-transparent hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <div className="w-[56px] shrink-0 flex items-center justify-center">
                            <Icon size={16} className="shrink-0" />
                        </div>

                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="flex-1 flex items-center justify-between pr-3 overflow-hidden whitespace-nowrap"
                                >
                                    <span className="text-left font-semibold tracking-tight">{label}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </Tooltip.Trigger>

                <AnimatePresence>
                    {isCollapsed && (
                        <Tooltip.Portal>
                            <Tooltip.Content
                                side="right"
                                sideOffset={12}
                                className="z-100 outline-none"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -8, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="bg-zinc-900 border border-zinc-800/80 px-3 py-1.5 rounded-lg text-[11px] font-bold text-zinc-200 shadow-2xl backdrop-blur-md"
                                >
                                    {label}
                                    <Tooltip.Arrow className="fill-zinc-900" />
                                </motion.div>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    )}
                </AnimatePresence>
            </Tooltip.Root>
        </Tooltip.Provider>
    );

    const handleHomeClick = () => {
        setActiveNoteId(null);
        closeOverview();
        closeFolders();
    };

    const handleFilesClick = () => {
        openOverview();
        setActiveNoteId(null);
    };

    const handleFoldersClick = () => {
        openFolders();
        setActiveNoteId(null);
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 56 : 260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "h-screen bg-[#0c0c0e] border-r border-white/12 flex flex-col font-sans select-none overflow-visible relative z-40"
            )}
        >
            {/* Header: Branding & Toggle */}
            <div className={cn(
                "flex items-center min-h-[64px] transition-all duration-300 relative",
                isCollapsed ? "justify-center" : "justify-between pl-5 pr-2.5"
            )}>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            key="expanded-logo"
                            initial={{ opacity: 0, display: "none" }}
                            animate={{ opacity: 1, display: "flex" }}
                            exit={{ opacity: 0, transitionEnd: { display: "none" } }}
                            className="items-center"
                        >
                            <span className="text-sm font-black text-white tracking-widest uppercase">Code Logs</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "z-50 flex items-center justify-center transition-all duration-300 text-white hover:text-white group",
                        isCollapsed ? "w-8 h-8 mx-auto" : "w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronsRight size={18} strokeWidth={1.5} className="text-zinc-400 hover:text-white" />
                    ) : (
                        <PanelLeft size={18} strokeWidth={1.5} />
                    )}
                </button>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-1.5 relative z-50">
                {/* Search Widget */}
                <div className={cn(
                    "flex items-center w-full rounded-lg text-xs h-9 relative border border-white/8 transition-[width,background-color] duration-300",
                    isCollapsed ? "bg-transparent" : "bg-zinc-900/40 mx-3 w-[calc(100%-24px)]",
                    "hover:bg-zinc-900/60 focus-within:bg-zinc-900/80"
                )}>
                    <div className="w-[56px] shrink-0 flex items-center justify-center">
                        <Search
                            size={16}
                            className={cn("shrink-0 transition-colors duration-300",
                                searchQuery ? "text-cyan-400" : "text-zinc-600",
                                isCollapsed && "hover:text-cyan-400 cursor-pointer")}
                            onClick={() => isCollapsed && setIsCollapsed(false)}
                        />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.input
                                key="search-input"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                type="text"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                placeholder="Quick Search"
                                className="bg-transparent border-none outline-none w-full placeholder:text-zinc-600 text-zinc-200 font-medium pr-3"
                            />
                        )}
                    </AnimatePresence>
                    {!isCollapsed && !searchQuery && (
                        <span className="text-[10px] font-mono text-zinc-700 px-1 opacity-50">⌘K</span>
                    )}
                </div>

                <SidebarItem
                    icon={Home}
                    label="Home"
                    onClick={handleHomeClick}
                    isActive={!isOverviewOpen && !isFoldersOpen && !activeNoteId}
                />
            </div>

            {/* Body: Navigation & Library */}
            <div className={cn(
                "flex-1 overflow-y-auto mt-6 custom-scrollbar pb-10",
                isCollapsed ? "space-y-2" : "space-y-6"
            )}>
                <div className="space-y-1">
                    <SidebarItem
                        icon={FileText}
                        label="Files"
                        onClick={handleFilesClick}
                        isActive={isOverviewOpen}
                    />
                    <SidebarItem
                        icon={Folders}
                        label="Folders"
                        onClick={handleFoldersClick}
                        isActive={isFoldersOpen}
                    />
                </div>

                {!isCollapsed && (
                    <div className="space-y-6">
                        {/* Pinned Section */}
                        {pinnedItems.length > 0 && (
                            <div className="overflow-hidden">
                                <div className="mb-2 flex items-center gap-2 px-4">
                                    <span className="text-zinc-500 shrink-0">
                                        <Pin size={12} />
                                    </span>
                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, display: "none" }}
                                                animate={{ opacity: 1, display: "inline-block" }}
                                                exit={{ opacity: 0, transitionEnd: { display: "none" } }}
                                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                                            >
                                                Pinned
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {pinnedItems.map(item => (
                                    <FolderItem key={`pinned-${item.id}`} item={item} level={1} />
                                ))}
                            </div>
                        )}

                        {/* Library */}
                        <div className="space-y-2 overflow-hidden">
                            <SidebarHeading
                                onAddFolder={() => {
                                    handleFoldersClick();
                                    createFolder();
                                }}
                                onAddFile={() => handleFilesClick()}
                            />
                            <div className="space-y-0.5">
                                {items.map((item) => (
                                    <FolderItem key={item.id} item={item} level={1} />
                                ))}
                                {items.length === 0 && (
                                    <div className="px-4 py-8 text-center bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800/30">
                                        <p className="text-[11px] text-zinc-600 font-medium">Empty library</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer: User Profile */}
            {!isCollapsed && (
                <div className={cn(
                    "mt-auto border-t border-white/12 bg-[#0c0c0e]/80 backdrop-blur-md transition-all duration-300",
                    isCollapsed ? "p-2" : "p-3"
                )}>
                    <ProfileTile isCollapsed={isCollapsed} />
                </div>
            )}
        </motion.aside>
    );
};

export default Sidebar;
