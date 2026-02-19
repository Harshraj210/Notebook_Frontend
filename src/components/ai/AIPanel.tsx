"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Brain, FileText, MessageSquare, Sparkles } from 'lucide-react';
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

const ChatView = () => {
    const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
        { role: 'ai', content: "Hi! I can help you understand this note better. Ask me anything!" }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'user' 
                                ? "bg-cyan-600 text-white rounded-br-none" 
                                : "bg-zinc-800 text-zinc-300 rounded-bl-none border border-zinc-700"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-zinc-800 bg-brand-dark">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask something about this note..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-10 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors placeholder:text-zinc-600"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 p-1.5 bg-zinc-800 text-zinc-400 rounded-md hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={14} />
                    </button>
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
            {/* Mobile Backdrop */}
            {isAIOpen && (
                <div 
                    onClick={toggleAI}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300 transition-opacity"
                    aria-hidden="true"
                />
            )}

            <aside 
                className={cn(
                    "fixed top-0 right-0 h-screen w-full md:w-[380px] bg-brand-dark border-l border-brand-border z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out will-change-transform",
                    isAIOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border bg-brand-dark/95 backdrop-blur shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span className="font-semibold text-zinc-100">AI Assistant</span>
                </div>
                <button 
                    onClick={toggleAI}
                    className="p-1.5 text-zinc-500 hover:text-zinc-200 bg-zinc-800/20 hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center p-1 bg-zinc-900/50 border-b border-brand-border shrink-0">
                {(['chat', 'summary', 'quiz'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setTab(tab)}
                        className={cn(
                            "flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200 capitalize flex items-center justify-center gap-2",
                            activeTab === tab 
                                ? "bg-zinc-800 text-zinc-100 shadow-sm" 
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                        )}
                    >
                        {tab === 'quiz' && <Brain size={14} />}
                        {tab === 'summary' && <FileText size={14} />}
                        {tab === 'chat' && <MessageSquare size={14} />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-brand-dark/50 relative">
                {activeTab === 'quiz' && <QuizView />}
                {activeTab === 'summary' && <SummaryView />}
                {activeTab === 'chat' && <ChatView />}
            </div>
        </aside>
        </>
    );
};

export default AIPanel;
