"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HTML_CLEANER_PATTERN } from '@/lib/regex';
import debounce from 'lodash.debounce';

interface SmartEditorProps {
    initialContent?: string;
    onSync?: (content: string) => void;
}

const SmartEditor = ({ initialContent = "", onSync }: SmartEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Anti-Hallucination Guardrail: Strip spans before re-render or sync
    const cleanHTML = (html: string) => {
        return html.replace(HTML_CLEANER_PATTERN, '');
    };

    // Initialize content only once when component mounts or key changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = initialContent;
        }
    }, []);

    const handleInput = debounce(() => {
        if (!editorRef.current) return;

        const rawHTML = editorRef.current.innerHTML;
        const cleanedText = editorRef.current.innerText; // Shadow text - raw plain text

        // Sync with external state (Zustand)
        if (onSync) onSync(cleanedText);

        console.log("Syncing shadow content:", cleanedText);
    }, 300);

    return (
        <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="outline-none min-h-[500px] p-6 font-mono text-sm leading-relaxed"
            spellCheck={false}
        />
    );
};

export default SmartEditor;
