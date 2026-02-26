"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Brain, FileText, Sparkles, Plus, ChevronDown, Mic, ArrowRight, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { cn } from '@/lib/utils';

// --- Mock Components ---

const QuizView = () => {
    const [quizGenerated, setQuizGenerated] = useState(false);

    if (!quizGenerated) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-2">
                    <Brain className="w-8 h-8 text-cyan-500" />
                </div>
                <h3 className="font-semibold text-zinc-200">Generate Quiz</h3>
                <p className="text-sm text-zinc-500">Test your knowledge based on the content of this note.</p>
                <button
                    onClick={() => setQuizGenerated(true)}
                    className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Sparkles size={16} /> Generate Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800 space-y-3">
                    <h4 className="font-medium text-sm text-zinc-200">Question 1</h4>
                    <p className="text-sm text-zinc-400">What is the primary function of the React UseEffect hook?</p>
                    <div className="space-y-2 mt-3">
                        {['State Management', 'Side Effects', 'Routing', 'Styling'].map((opt, i) => (
                            <button key={i} className="w-full text-left px-3 py-2 rounded bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors">
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800 space-y-3 opacity-50">
                    <h4 className="font-medium text-sm text-zinc-200">Question 2</h4>
                    <p className="text-sm text-zinc-400">Which hook is used for performance optimization?</p>
                    <div className="space-y-2 mt-3">
                        {['useMemo', 'useState', 'useEffect', 'useContext'].map((opt, i) => (
                            <div key={i} className="w-full text-left px-3 py-2 rounded bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-500">
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const SummaryView = () => {
    const [summaryGenerated, setSummaryGenerated] = useState(false);

    if (!summaryGenerated) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-2">
                    <FileText className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold text-zinc-200">Summarize Note</h3>
                <p className="text-sm text-zinc-500">Get a quick concise summary of the key points.</p>
                <button
                    onClick={() => setSummaryGenerated(true)}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Sparkles size={16} /> Generate Summary
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 animate-in fade-in duration-300">
            <div className="prose prose-invert prose-sm">
                <h4 className="text-zinc-200 font-semibold mb-2">Summary</h4>
                <p className="text-zinc-400 leading-relaxed text-sm">
                    This note covers the fundamentals of React hooks, focusing on state management with <code className="text-cyan-400">useState</code> and side effects with <code className="text-cyan-400">useEffect</code>. It explains the dependency array and cleanup functions.
                </p>
                <ul className="text-zinc-400 text-sm list-disc pl-4 mt-2 space-y-1">
                    <li>Hooks rules and best practices</li>
                    <li>Custom hooks creation</li>
                    <li>Common pitfalls</li>
                </ul>
            </div>
        </div>
    );
}

type Message = { role: 'user' | 'ai', content: string };

const ChatView = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: "Welcome! I'm Klaer AI. I can analyze your notes, summarize content, and help you learn. What would you like to do?" }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<Record<number, 'up' | 'down'>>({});
    const [feedbackCompleted, setFeedbackCompleted] = useState<Record<number, boolean>>({});
    const [floatingIcons, setFloatingIcons] = useState<{ id: number; msgIdx: number; icon: string }[]>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCopy = (content: string, idx: number) => {
        navigator.clipboard.writeText(content);
        setCopiedId(idx);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFeedback = (idx: number, type: 'up' | 'down') => {
        if (feedbackCompleted[idx]) return; // Prevent double clicks
        setFeedback(prev => ({ ...prev, [idx]: type }));
        const id = Date.now();
        setFloatingIcons(prev => [...prev, { id, msgIdx: idx, icon: type === 'up' ? '👍' : '👎' }]);
        setTimeout(() => {
            setFloatingIcons(prev => prev.filter(icon => icon.id !== id));
            setFeedbackCompleted(prev => ({ ...prev, [idx]: true }));
        }, 600);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "This is a mock response based on your note content. Since I'm running locally without a backend, I can't really analyze the text, but I'm here to demonstrate the UI!"
            }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full">
            <style>{`
                @keyframes floatIcon {
                    0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -15px) scale(1.4); opacity: 0.8; }
                    100% { transform: translate(-50%, -30px) scale(0); opacity: 0; }
                }
                .animate-float-icon {
                    animation: floatIcon 600ms ease-out forwards;
                }
            `}</style>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500 mt-10">
                        <div className="w-12 h-12 bg-zinc-800/40 border border-zinc-800/50 rounded-full flex items-center justify-center mb-2">
                            <Sparkles className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="text-zinc-400 text-sm max-w-[80%]">Hi! I can help you understand this note better. Ask me anything!</p>
                    </div>
                ) : messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        {msg.role === 'user' ? (
                            <div className="max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed bg-cyan-600 text-white rounded-br-sm">
                                {msg.content}
                            </div>
                        ) : (
                            <div className="group flex flex-col items-start gap-1 max-w-[85%] w-full">
                                <div className="px-4 py-3 rounded-2xl text-[13px] leading-relaxed bg-zinc-800/80 text-zinc-200 rounded-bl-sm border border-zinc-700/50 shadow-sm">
                                    {msg.content}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-none ml-2">
                                    <button
                                        onClick={() => handleCopy(msg.content, idx)}
                                        className="p-1 rounded-sm text-zinc-500 hover:text-white transition-colors relative flex items-center justify-center"
                                        title="Copy"
                                    >
                                        {copiedId === idx ? (
                                            <Check size={16} className="text-white animate-in zoom-in-75 duration-200" />
                                        ) : (
                                            <Copy size={16} className="animate-in zoom-in-95 duration-200" />
                                        )}
                                        {copiedId === idx && (
                                            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-top-1 duration-200 z-10">
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                    {!feedbackCompleted[idx] && (
                                        <>
                                            <button
                                                onClick={() => handleFeedback(idx, 'up')}
                                                className={cn(
                                                    "p-1 rounded-sm transition-colors relative",
                                                    feedback[idx] === 'up' ? "text-green-500" : "text-zinc-500 hover:text-green-500"
                                                )}
                                                title="Helpful"
                                            >
                                                <ThumbsUp size={16} className={cn(feedback[idx] === 'up' && "fill-green-500/20")} />
                                                {floatingIcons.map(f => f.msgIdx === idx && f.icon === '👍' && (
                                                    <span key={f.id} className="absolute left-1/2 top-0 pointer-events-none animate-float-icon text-base">👍</span>
                                                ))}
                                            </button>
                                            <button
                                                onClick={() => handleFeedback(idx, 'down')}
                                                className={cn(
                                                    "p-1 rounded-sm transition-colors relative",
                                                    feedback[idx] === 'down' ? "text-red-500" : "text-zinc-500 hover:text-red-500"
                                                )}
                                                title="Not Helpful"
                                            >
                                                <ThumbsDown size={16} className={cn(feedback[idx] === 'down' && "fill-red-500/20")} />
                                                {floatingIcons.map(f => f.msgIdx === idx && f.icon === '👎' && (
                                                    <span key={f.id} className="absolute left-1/2 top-0 pointer-events-none animate-float-icon text-base">👎</span>
                                                ))}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-brand-dark/95 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex flex-col gap-2 w-full bg-zinc-900/50 border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[10px_14px] shadow-sm transition-all focus-within:bg-zinc-900/80 focus-within:border-[rgba(255,255,255,0.2)]">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything."
                        className="w-full bg-transparent border-none text-sm text-zinc-200 focus:outline-none focus:ring-0 placeholder:text-zinc-500 py-1"
                    />

                    <div className="flex items-center justify-between w-full mt-1">
                        <div className="flex items-center gap-2">
                            <button
                                title="Add Attachment"
                                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                            <button
                                title="Select Model"
                                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                            >
                                Klaer AI <ChevronDown size={14} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                title="Voice Input"
                                className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors"
                            >
                                <Mic size={18} />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="p-1.5 rounded-full bg-zinc-100 text-black hover:bg-white disabled:opacity-40 disabled:hover:bg-zinc-100 disabled:text-zinc-500 transition-colors focus:outline-none flex items-center justify-center shrink-0"
                            >
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Panel Component ---

const AIPanel = () => {
    const { isAIOpen, toggleAI, activeTab, setTab } = useAIStore();

    return (
        <>

            <aside
                className={cn(
                    "fixed top-0 right-0 h-screen w-full md:w-[380px] bg-brand-dark border-l border-brand-border z-50 flex flex-col shadow-2xl transform transition-transform duration-300 will-change-transform",
                    isAIOpen ? "translate-x-0 ease-out" : "translate-x-full ease-in"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-brand-border/50 bg-brand-dark/95 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-[18px] h-[18px] flex items-center justify-center rounded-[4px] bg-linear-to-b from-cyan-300 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] border border-cyan-200/50">
                            <span className="text-black text-[12px] font-bold leading-none select-none tracking-tighter ml-[0.5px]">K</span>
                        </div>
                        <span className="font-semibold text-[15px] text-zinc-100 tracking-wide">Klaer AI</span>
                    </div>
                    <button
                        onClick={toggleAI}
                        className="p-2 text-zinc-500 hover:text-zinc-300 bg-transparent hover:bg-zinc-800/50 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="p-4 bg-brand-dark/95 border-b border-brand-border/50 shrink-0">
                    <div className="flex items-center p-1 bg-zinc-900/80 rounded-full border border-[rgba(255,255,255,0.03)] shadow-inner">
                        {(['chat', 'summary', 'quiz'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setTab(tab)}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-medium rounded-full transition-all duration-300 capitalize flex items-center justify-center gap-2",
                                    activeTab === tab
                                        ? "bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-white/5"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-brand-dark/50 relative">
                    {activeTab === 'quiz' && <QuizView />}
                    {activeTab === 'summary' && <SummaryView />}
                    {activeTab === 'chat' && <ChatView />}
                </div>
            </aside >
        </>
    );
};

export default AIPanel;
