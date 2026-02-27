"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
    FolderOpen,
    Plus,
    PanelLeft,
    ChevronsRight,
    ChevronsLeft,
    Settings,
    HelpCircle,
    Layout,
    Pin,
    LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { workspaces, activeWorkspaceId, setActiveNoteId, activeNoteId } = useNotebookStore();
    const { files, openOverview, isOverviewOpen, openFolders, isFoldersOpen, closeFolders, closeOverview, selectFile, toggleFilePin } = useFileStore();
    const { folders, openFolder, createFolder } = useFolderStore();
    const router = useRouter();
    const pathname = usePathname();

    // ── Smart Search ──────────────────────────────────────────────────────────
    type SearchResult =
        | { type: 'folder'; id: string; label: string }
        | { type: 'root-file'; id: string; label: string }
        | { type: 'folder-file'; id: string; label: string; folderId: string; folderName: string };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounced search across all 3 sources
    useEffect(() => {
        const timer = setTimeout(() => {
            const q = searchQuery.trim();
            if (!q) {
                setSearchResults([]);
                setSearchOpen(false);
                setActiveIndex(-1);
                return;
            }
            let regex: RegExp;
            try {
                regex = new RegExp(q, 'i');
            } catch {
                setSearchResults([]);
                return;
            }

            const folderMatches: SearchResult[] = folders
                .filter(f => regex.test(f.name))
                .map(f => ({ type: 'folder', id: f.id, label: f.name }));

            const rootFileMatches: SearchResult[] = files
                .filter(f => regex.test(f.title))
                .map(f => ({ type: 'root-file', id: f.id, label: f.title }));

            const folderFileMatches: SearchResult[] = folders.flatMap(f =>
                f.files
                    .filter(file => regex.test(file.title))
                    .map(file => ({
                        type: 'folder-file' as const,
                        id: file.id,
                        label: file.title,
                        folderId: f.id,
                        folderName: f.name,
                    }))
            );

            const merged = [...folderMatches, ...rootFileMatches, ...folderFileMatches].slice(0, 15);
            setSearchResults(merged);
            setSearchOpen(merged.length > 0 || q.length > 0); // open regardless to show "no results"
            setActiveIndex(-1);
        }, 150);
        return () => clearTimeout(timer);
    }, [searchQuery, files, folders]);

    // Click-outside to close dropdown
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const closeSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchOpen(false);
        setActiveIndex(-1);
    }, []);

    const handleResultClick = useCallback((result: SearchResult) => {
        if (result.type === 'folder') {
            openFolders();
            openFolder(result.id);
        } else if (result.type === 'root-file') {
            selectFile(result.id);
        } else {
            openFolders();
            openFolder(result.folderId);
        }
        closeSearch();
    }, [openFolders, openFolder, selectFile, closeSearch]);

    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!searchOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleResultClick(searchResults[activeIndex]);
        } else if (e.key === 'Escape') {
            closeSearch();
        }
    }, [searchOpen, searchResults, activeIndex, handleResultClick, closeSearch]);

    // View state: 'default' (folders) | 'files' are handled by useFileStore's isOverviewOpen now effectively
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    // ── Pinned: single source of truth from both stores ──────────────────────
    // Root-level pinned files (from useFileStore)
    const pinnedRootFiles = files.filter((f) => f.pinned);
    // Folder-level pinned files (from useFolderStore)
    const pinnedFolderFiles = folders.flatMap((folder) =>
        folder.files.filter((f) => f.pinned).map((f) => ({ ...f, _folderName: folder.name, _folderId: folder.id }))
    );
    const hasPinned = pinnedRootFiles.length > 0 || pinnedFolderFiles.length > 0;

    // Legacy notebook pinned (keep for backwards compat if library section uses it)
    const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);
    const items = activeWorkspace?.folders || [];

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

    const handleDashboardClick = () => {
        router.push('/profile');
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
            {/* Header: Code Logs branding + collapse toggle */}
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
                        <ChevronsLeft size={16} strokeWidth={2} />
                    )}
                </button>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-1.5 relative z-50">
                {/* Search Widget */}
                <div
                    ref={searchRef}
                    className={cn(
                        "relative flex flex-col w-full",
                        isCollapsed ? "" : "mx-3 w-[calc(100%-24px)]"
                    )}
                >
                    {/* Input row */}
                    <div className={cn(
                        "flex items-center w-full rounded-lg text-xs h-9 border border-white/8 transition-[background-color] duration-300",
                        isCollapsed ? "bg-transparent" : "bg-zinc-900/40",
                        "hover:bg-zinc-900/60 focus-within:bg-zinc-900/80",
                        searchOpen && !isCollapsed ? "rounded-b-none border-b-zinc-800/50" : ""
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value.trim()) setSearchOpen(true);
                                    }}
                                    onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Quick Search"
                                    className="bg-transparent border-none outline-none w-full placeholder:text-zinc-600 text-zinc-200 font-medium pr-3"
                                />
                            )}
                        </AnimatePresence>
                        {!isCollapsed && !searchQuery && (
                            <span className="text-[10px] font-mono text-zinc-700 px-1 opacity-50">⌘K</span>
                        )}
                    </div>

                    {/* Results Dropdown */}
                    <AnimatePresence>
                        {!isCollapsed && searchOpen && (
                            <motion.div
                                key="search-dropdown"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="absolute top-full left-0 right-0 z-[200] bg-zinc-900 border border-white/8 border-t-0 rounded-b-lg shadow-2xl overflow-hidden"
                            >
                                {searchResults.length === 0 ? (
                                    <div className="px-4 py-3 text-[11px] text-zinc-600 font-medium">
                                        No results found
                                    </div>
                                ) : (
                                    <div className="overflow-y-auto max-h-[280px] py-1 custom-scrollbar">
                                        {searchResults.map((result, idx) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onMouseDown={(e) => { e.preventDefault(); handleResultClick(result); }}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                className={cn(
                                                    "flex items-center gap-2.5 w-full px-3 py-2 text-left transition-colors duration-100 outline-none",
                                                    idx === activeIndex
                                                        ? "bg-zinc-800 text-zinc-100"
                                                        : "text-zinc-300 hover:bg-zinc-800/60"
                                                )}
                                            >
                                                {result.type === 'folder' ? (
                                                    <FolderOpen size={13} className="shrink-0 text-amber-400" />
                                                ) : (
                                                    <FileText size={13} className={cn(
                                                        "shrink-0",
                                                        result.type === 'root-file' ? "text-cyan-400" : "text-indigo-400"
                                                    )} />
                                                )}
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[12px] font-semibold truncate leading-tight">
                                                        {result.label}
                                                    </span>
                                                    {result.type === 'folder-file' && (
                                                        <span className="text-[10px] text-zinc-500 truncate leading-tight">
                                                            in {result.folderName}
                                                        </span>
                                                    )}
                                                    {result.type === 'root-file' && (
                                                        <span className="text-[10px] text-zinc-600 truncate leading-tight">
                                                            Root file
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                        {/* Pinned Section — reads from useFileStore + useFolderStore */}
                        {hasPinned && (
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

                                {/* Root-level pinned files */}
                                {pinnedRootFiles.map((file) => (
                                    <div
                                        key={`pin-root-${file.id}`}
                                        onClick={() => selectFile(file.id)}
                                        className="flex items-center gap-2 w-full px-4 py-1.5 text-left hover:bg-zinc-800/50 rounded-lg transition-colors group/pin cursor-pointer"
                                    >
                                        <FileText size={12} className="text-cyan-500 shrink-0" />
                                        <span className="text-xs text-zinc-300 truncate flex-1 font-medium">
                                            {file.title}
                                        </span>
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => { e.stopPropagation(); toggleFilePin(file.id); }}
                                            onKeyDown={(e) => e.key === 'Enter' && toggleFilePin(file.id)}
                                            className="opacity-0 group-hover/pin:opacity-100 text-zinc-600 hover:text-zinc-300 transition-all cursor-pointer p-0.5 rounded"
                                            title="Unpin"
                                        >
                                            <Pin size={10} className="rotate-45" />
                                        </span>
                                    </div>
                                ))}

                                {/* Folder-level pinned files */}
                                {pinnedFolderFiles.map((file) => (
                                    <div
                                        key={`pin-folder-${file.id}`}
                                        onClick={() => { openFolders(); openFolder(file._folderId); }}
                                        className="flex items-center gap-2 w-full px-4 py-1.5 text-left hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <FileText size={12} className="text-indigo-400 shrink-0" />
                                        <span className="text-xs text-zinc-300 truncate flex-1 font-medium">
                                            {file.title}
                                        </span>
                                        <span className="text-[9px] text-zinc-600 truncate max-w-[50px]">{file._folderName}</span>
                                    </div>
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
            {/* Dashboard nav item — above footer */}
            <div className="px-0 pb-1">
                <SidebarItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    onClick={handleDashboardClick}
                    isActive={pathname === '/profile'}
                />
            </div>

            {/* Footer: Profile tile */}
            <div className={cn(
                "border-t border-white/5 bg-[#0c0c0e]/80 backdrop-blur-md transition-all duration-300",
                isCollapsed ? "p-2" : "p-3"
            )}>
                <ProfileTile isCollapsed={isCollapsed} />
            </div>

        </motion.aside>
    );
};

export default Sidebar;
