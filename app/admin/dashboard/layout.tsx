"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  Download,
  Users,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ActivityProvider } from "@/lib/activity-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload Certificates",
    href: "/admin/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Download Reports",
    href: "/admin/dashboard/reports",
    icon: Download,
  },
  {
    title: "Manage Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

const sidebarVariants = {
  hidden: { x: -64, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // Add any logout logic here
    router.push("/admin");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <ActivityProvider>
      <div className="min-h-screen bg-[#0A0118]">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3B82F6_0%,_transparent_50%)]"
            style={{ opacity: 0.03 }}
          ></div>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#60A5FA_0%,_transparent_30%)]"
            style={{ opacity: 0.03 }}
          ></div>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#2563EB_0%,_transparent_30%)]"
            style={{ opacity: 0.03 }}
          ></div>
        </div>

        {/* Sidebar */}
        <motion.aside
          className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#110C1D]"
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-white/10 px-6 py-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <h1 className="text-xl font-bold text-white mt-4">
                Admin Portal
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blue-500/10 text-blue-500"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="border-t border-white/10 p-4">
              <Button
                onClick={handleLogout}
                className="w-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          className="pl-64"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <div className="container mx-auto p-8">{children}</div>
        </motion.main>
      </div>
    </ActivityProvider>
  );
}
