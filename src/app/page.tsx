"use client";

import Sidebar from '@/components/layout/Sidebar';
import EditorCanvas from '@/components/editor/EditorCanvas';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-[#0c0c0e] text-zinc-300 overflow-hidden">
      {/* Identity-First Sidebar */}
      <Sidebar />

      {/* The Core Editor Engine / Main View */}
      <EditorCanvas />
    </div>
  );
}
