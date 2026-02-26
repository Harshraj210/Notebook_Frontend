"use client";

import React from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileTile = ({ isCollapsed }: { isCollapsed?: boolean }) => {
    const { name } = useUserStore();

    const getInitials = (fullName: string) => {
        const parts = fullName.split(' ').filter((p) => p.length > 0);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return (fullName || 'U').slice(0, 1).toUpperCase();
    };

    const initials = getInitials(name || 'User');
    const firstName = name ? name.split(' ')[0] : 'User';

    return (
        <Link href="/profile" className="block w-full outline-none">
            <button
                className={cn(
                    "flex flex-row items-center w-full hover:bg-zinc-800/80 rounded-xl transition-all duration-300 outline-none text-left border border-transparent hover:border-white/5 group relative h-12",
                    isCollapsed ? "justify-center" : ""
                )}
            >
                <div className={cn("shrink-0 flex items-center justify-center", isCollapsed ? "w-[56px]" : "w-10")}>
                    <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                        {initials}
                    </div>
                </div>

                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-hidden flex flex-col justify-center ml-2 text-left"
                    >
                        <div className="text-[14px] font-bold text-[#e1e1e1] tracking-tight truncate leading-none">
                            Hi, {firstName}
                        </div>
                    </motion.div>
                )}
            </button>
        </Link>
    );
};

export default ProfileTile;
