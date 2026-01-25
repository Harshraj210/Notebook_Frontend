import { create } from 'zustand';

export interface NotebookItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
    children?: NotebookItem[];
    content?: string;
    isPinned?: boolean;
    isOpen?: boolean; // For folder expansion state
}

export interface Workspace {
    id: string;
    name: string;
    folders: NotebookItem[];
}

interface NotebookState {
    workspaces: Workspace[];
    activeWorkspaceId: string;
    activeNoteId: string | null;

    // Actions
    setActiveWorkspaceId: (id: string) => void;
    setActiveNoteId: (id: string | null) => void;
    updateShadowContent: (id: string, content: string) => void;
    toggleFolder: (id: string) => void;
    addItem: (parentId: string | null, type: 'file' | 'folder', name: string) => void;
}

export const useNotebookStore = create<NotebookState>((set) => ({
    workspaces: [
        {
            id: 'personal',
            name: "Personal",
            folders: [
                {
                    id: 'folder-1',
                    name: 'Drafts',
                    type: 'folder',
                    parentId: null,
                    isOpen: true,
                    children: [
                        { id: 'note-1', name: 'Ideas.md', type: 'file', parentId: 'folder-1', isPinned: true },
                    ]
                },
                {
                    id: 'note-2',
                    name: 'Project Outline.md',
                    type: 'file',
                    parentId: null,
                    isPinned: false
                }
            ]
        },
        {
            id: 'job-portal',
            name: "Job Portal",
            folders: []
        }
    ],
    activeWorkspaceId: 'personal',
    activeNoteId: null,

    setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
    setActiveNoteId: (id) => set({ activeNoteId: id }),

    toggleFolder: (id) => set((state) => {
        const updateRecursive = (items: NotebookItem[]): NotebookItem[] => {
            return items.map((item) => {
                if (item.id === id) {
                    return { ...item, isOpen: !item.isOpen };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };

        const newWorkspaces = state.workspaces.map(ws =>
            ws.id === state.activeWorkspaceId
                ? { ...ws, folders: updateRecursive(ws.folders) }
                : ws
        );

        return { workspaces: newWorkspaces };
    }),

    updateShadowContent: (id, content) => set((state) => {
        const updateRecursive = (items: NotebookItem[]): NotebookItem[] => {
            return items.map((item) => {
                if (item.id === id) {
                    return { ...item, content };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };

        const newWorkspaces = state.workspaces.map(ws =>
            ws.id === state.activeWorkspaceId
                ? { ...ws, folders: updateRecursive(ws.folders) }
                : ws
        );

        return { workspaces: newWorkspaces };
    }),

    addItem: (parentId, type, name) => set((state) => {
        // Simplified add logic for now
        return state;
    }),
}));
