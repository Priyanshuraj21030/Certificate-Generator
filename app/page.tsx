"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <ThemeToggle />

      <motion.div
        className="relative min-h-screen flex items-center justify-center p-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Card className="glass-card max-w-4xl w-full p-8 space-y-8">
          <motion.div className="text-center space-y-4" variants={item}>
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Certificate Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Access and download your certificates securely. A centralized
              platform for managing all your academic achievements.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            variants={container}
          >
            <motion.div variants={item}>
              <Link href="/login" className="block group">
                <div className="border rounded-xl p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:bg-primary/5 dark:border-gray-700 dark:hover:border-primary/50">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold dark:text-white">
                    Student Portal
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access your certificates using your registration number
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={item}>
              <Link href="/admin" className="block group">
                <div className="border rounded-xl p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:bg-primary/5 dark:border-gray-700 dark:hover:border-primary/50">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold dark:text-white">
                    Admin Portal
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage certificates and user access
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="pt-8 border-t dark:border-gray-700"
            variants={item}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
              <p>© 2025 Certificate Portal. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="#" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </main>
  );
}
