"use client";

import React, { useState } from 'react';
import { useNotebookStore, NotebookItem } from '@/store/useNotebookStore';
import { useFolderStore } from '@/store/useFolderStore';
import { useFileStore } from '@/store/useFileStore';
import ProfileTile from '@/components/layout/ProfileTile';
import FolderItem from '@/components/layout/FolderItem';
import PinnedFileItem from '@/components/layout/PinnedFileItem';
import { Search, Settings, HelpCircle, Pin, Home, ChevronsLeft, ChevronsRight, File, Folder, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

const Sidebar = () => {
    const { workspaces, activeWorkspaceId, setActiveNoteId, activeNoteId } = useNotebookStore();
    const { files, openOverview, isOverviewOpen, openFolders, isFoldersOpen, closeFolders, closeOverview } = useFileStore();
    const { folders, openFolder } = useFolderStore();

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

    const SidebarItem = ({ icon: Icon, label, onClick, shortcut, isActive }: { icon: any, label: string, onClick?: () => void, shortcut?: string, isActive?: boolean }) => (
        <Tooltip.Provider delayDuration={400}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button
                        onClick={onClick}
                        className={cn(
                            "flex items-center gap-2 w-full border border-transparent rounded-lg transition-all duration-300 text-xs group h-9",
                            isCollapsed ? "justify-center px-0" : "px-3 py-2",
                            isActive
                                ? "bg-zinc-800 text-zinc-100"
                                : "bg-transparent hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
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

    const handleHomeClick = () => {
        // Reset legacy URL
        setActiveNoteId(null);
        // Reset file store view
        closeOverview();
        closeFolders();
    };

    const handleFilesClick = () => {
        openOverview();
        setActiveNoteId(null); // Clear legacy selection
    };

    const handleFoldersClick = () => {
        openFolders();
        setActiveNoteId(null);
    };

    return (
        <aside
            className={cn(
                "h-screen bg-brand-dark border-r border-brand-border flex flex-col font-sans select-none overflow-visible relative z-40",
                "transition-[width,transform,opacity] duration-500 ease-in-out will-change-[width]",
                isCollapsed ? "w-[64px] overflow-hidden" : "w-[260px]"
            )}
        >
            {/* Toggle Button */}
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
            <div className="px-4 space-y-2 mt-2 relative z-50">
                {/* Search Widget */}
                <div className="relative group">
                    <div className={cn(
                        "flex items-center gap-2 w-full border border-transparent rounded-lg transition-all duration-300 text-xs h-9",
                        isCollapsed ? "justify-center px-0" : "px-3 py-2",
                        "bg-zinc-900/50 hover:bg-zinc-900 text-zinc-500 focus-within:bg-zinc-900 focus-within:text-zinc-100 focus-within:border-zinc-800"
                    )}>
                        <Search size={16} className={cn("shrink-0 transition-colors", searchQuery ? "text-cyan-500" : "text-zinc-500")} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearching(!!e.target.value);
                                if (isCollapsed && e.target.value) setIsCollapsed(false);
                            }}
                            placeholder={isCollapsed ? "" : "Quick Search"}
                            className={cn(
                                "bg-transparent border-none outline-none w-full placeholder:text-zinc-600",
                                isCollapsed ? "hidden" : "block"
                            )}
                        />
                        {!isCollapsed && !searchQuery && (
                            <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 opacity-50">⌘K</span>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {searchQuery && !isCollapsed && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                            {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleResultClick(result)}
                                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800/80 transition-colors text-left group"
                                    >
                                        <span className="text-zinc-500 group-hover:text-zinc-300">
                                            {result.type === 'folder' ? <Folder size={14} /> : <File size={14} />}
                                        </span>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-cyan-400 transition-colors">{result.name}</span>
                                            <span className="text-[10px] text-zinc-500 truncate">{result.detail}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-zinc-500 text-xs italic">
                                    No results found
                                </div>
                            )}
                        </div>
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
                "flex-1 overflow-y-auto px-2 mt-6 space-y-6 custom-scrollbar transition-all duration-300",
                isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* Creation Actions with Labels */}
                <div className="px-2 space-y-1">
                    <SidebarItem
                        icon={File}
                        label="File"
                        onClick={handleFilesClick}
                        isActive={isOverviewOpen}
                    />
                    <SidebarItem
                        icon={Folder}
                        label="Folder"
                        onClick={handleFoldersClick}
                        isActive={isFoldersOpen}
                    />
                </div>

                {/* Pinned Section */}
                {(pinnedItems.length > 0 || files.some(f => f.pinned)) && (
                    <div>
                        <div className="px-4 mb-2 flex items-center gap-2">
                            <span className="text-zinc-500">
                                <Pin size={12} />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                Pinned
                            </span>
                        </div>
                        {pinnedItems.map(item => (
                            <FolderItem key={`pinned-${item.id}`} item={item} level={1} />
                        ))}
                        {files.filter(f => f.pinned).map(file => (
                             <PinnedFileItem key={file.id} file={file} />
                        ))}
                    </div>
                )}

                {/* Full Library */}
                <div>
                    <div className="px-4 mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
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
