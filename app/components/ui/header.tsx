'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src="/logo.png"
              alt="The Forge Logo"
              fill
              className="object-contain transition-transform group-hover:scale-110"
              priority
            />
          </div>
          <span className="hidden md:inline-block text-xl font-bold tracking-wider text-primary group-hover:text-primary/90 transition-colors">
            THE FORGE
          </span>
        </Link>
      </div>
    </motion.header>
  );
}
