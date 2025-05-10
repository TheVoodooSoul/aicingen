'use client';

import { motion } from 'framer-motion';

interface FilmRollLayoutProps {
  children: React.ReactNode;
}

export function FilmRollLayout({ children }: FilmRollLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <motion.div
        className="film-roll-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-background to-transparent" />
      </motion.div>
      
      <motion.div
        className="film-roll-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-background to-transparent" />
      </motion.div>
      
      <div className="mx-auto px-[35px] md:px-[35px]">
        {children}
      </div>
    </div>
  );
}
