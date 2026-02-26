import React, { useRef, useState, useEffect } from 'react';
import { useFileStore } from '@/store/useFileStore';
import { useAIStore } from '@/store/useAIStore';
import { ArrowLeft, FileText, LayoutTemplate, Share2, Sparkles, Star } from 'lucide-react';
import SmartEditor from '@/components/editor/SmartEditor';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';
import { cn } from '@/lib/utils';

const FileEditorView = () => {
    const { activeFileId, files, closeFile, updateFileContent, updateFileTitle, toggleFilePin } = useFileStore();
    const { isAIOpen, toggleAI } = useAIStore();
    const activeFile = files.find(f => f.id === activeFileId);

    // Animation synced state
    const [lottie, setLottie] = useState<DotLottie | null>(null);
    const [isInteracting, setIsInteracting] = useState(false);

    // Track previous open state to detect when the panel is closed by the user
    // clicking the X inside the panel (via Zustand store change)
    const prevAIOpen = useRef(isAIOpen);

    useEffect(() => {
        if (!lottie) return;

        // Detect Close Event: isAIOpen went from TRUE to FALSE
        if (prevAIOpen.current && !isAIOpen) {
            setIsInteracting(true);
            lottie.setLoop(false);
            lottie.stop();
            lottie.play();

            setTimeout(() => {
                lottie.setLoop(true);
                lottie.play();
                setIsInteracting(false);
            }, 800);
        }

        prevAIOpen.current = isAIOpen;
    }, [isAIOpen, lottie]);

    const handleIconClick = () => {
        if (isAIOpen || isInteracting || !lottie) {
            if (!isAIOpen) toggleAI();
            return;
        }

        // Action: Open
        setIsInteracting(true);
        lottie.setLoop(false);
        lottie.stop();
        lottie.play();
        toggleAI(); // Open the panel instantly

        setTimeout(() => {
            lottie.setLoop(true);
            lottie.play();
            setIsInteracting(false);
        }, 800);
    };

    if (!activeFile) return null;

    const handleCanvasClick = (e: React.MouseEvent) => {
        // If clicking on the canvas container (not exactly on the editor text), focus the editor
        // We'll dispatch a custom event or let the editor handle focus if possible, 
        // but since we want the whole area clickable:
        const editorEl = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editorEl) {
            editorEl.focus();

            // Move cursor to end if it's empty or we just want general focus
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editorEl);
            range.collapse(false); // collapse to end
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-100 relative overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-[#0c0c0e] z-50">
                <div className="flex items-center gap-4 w-full max-w-2xl">
                    <button
                        onClick={closeFile}
                        className="p-2 hover:bg-zinc-800 rounded-full text-cyan-500 transition-colors shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <input
                        type="text"
                        value={activeFile.title}
                        onChange={(e) => updateFileTitle(activeFile.id, e.target.value)}
                        placeholder="Untitled Note"
                        autoComplete="off"
                        spellCheck={false}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-100 placeholder-zinc-500 w-full cursor-text"
                    />
                </div>

                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => console.log('Share clicked')}
                        title="Share Note"
                        className="px-[12px] py-[6px] rounded-[8px] bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-colors text-white text-sm font-medium flex items-center justify-center shadow-none backdrop-blur-none"
                        style={{ filter: 'none', backdropFilter: 'none', boxShadow: 'none' }}
                    >
                        Share
                    </button>

                    <button
                        onClick={() => toggleFilePin(activeFile.id)}
                        title={activeFile.pinned ? "Unstar Note" : "Star Note"}
                        className={cn(
                            "p-[6px] rounded-[8px] bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-colors duration-200 flex items-center justify-center shadow-none backdrop-blur-none",
                            activeFile.pinned ? "text-[#FFD700]" : "text-white"
                        )}
                        style={{ filter: 'none', backdropFilter: 'none', boxShadow: 'none' }}
                    >
                        <Star size={20} className={cn("transition-all duration-200", activeFile.pinned && "fill-[#FFD700]")} style={{ filter: 'none', boxShadow: 'none' }} />
                    </button>

                    {/* Keep the button mounted so the WebGL Lottie context doesn't destroy itself, but use CSS to completely hide and disable it smoothly when the panel is open */}
                    <button
                        onClick={handleIconClick}
                        title="Open Klaer AI"
                        className={cn(
                            "group w-[40px] h-[40px] flex items-center justify-center rounded-[50%] bg-[rgba(255,255,255,0.08)] border border-zinc-800/80 hover:border-zinc-700 hover:bg-[rgba(255,255,255,0.12)] shadow-sm overflow-hidden transition-all duration-300",
                            isAIOpen ? "opacity-0 scale-90 pointer-events-none absolute right-0" : "opacity-100 scale-100 pointer-events-auto"
                        )}
                    >
                        <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] flex items-center justify-center brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100">
                            <DotLottieReact
                                src="/klaer-ai-icon.lottie"
                                loop
                                autoplay
                                dotLottieRefCallback={setLottie}
                            />
                        </div>
                    </button>
                </div>
            </header>

            {/* Editor Container */}
            <div
                className="flex-1 overflow-y-auto custom-scrollbar cursor-text"
                onClick={handleCanvasClick}
            >
                <main className="max-w-4xl mx-auto min-h-full pb-32" style={{ padding: '40px 60px' }}>
                    <div onClick={(e) => e.stopPropagation()} className="cursor-text h-full">
                        <SmartEditor
                            key={activeFile.id}
                            initialContent={activeFile.content}
                            onSync={(content) => updateFileContent(activeFile.id, content)}
                            autoFocus
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FileEditorView;
