"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Download,
  Users,
  Settings,
  Award,
  FileCheck,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activity-context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  regNumber: string;
  password: string;
  lastLogin: string | null;
  hasDownloadedCertificate: boolean;
}

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
}

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

export default function AdminDashboard() {
  const { activities } = useActivity();
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateStats = () => {
      const savedUsers = localStorage.getItem("users");
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

      const activeUsers = users.filter(
        (user) => user.status === "Active"
      ).length;
      const totalUsers = users.length;
      const certificatesDownloaded = users.filter(
        (user) => user.hasDownloadedCertificate
      ).length;

      // Calculate month-over-month changes
      // For this example, we'll use placeholder growth rates
      // In a real app, you would compare with last month's data
      const activeGrowth = ((activeUsers / (totalUsers || 1)) * 100).toFixed(1);
      const certGrowth = (
        (certificatesDownloaded / (totalUsers || 1)) *
        100
      ).toFixed(1);

      const stats: Stat[] = [
        {
          title: "Total Users",
          value: totalUsers.toString(),
          change: `+${activeGrowth}%`,
          trend: "up" as const,
          icon: Users,
        },
        {
          title: "Active Users",
          value: activeUsers.toString(),
          change: `+${activeGrowth}%`,
          trend: "up" as const,
          icon: Award,
        },
        {
          title: "Certificates Downloaded",
          value: certificatesDownloaded.toString(),
          change: `+${certGrowth}%`,
          trend: "up" as const,
          icon: FileCheck,
        },
      ];

      return stats;
    };

    setStats(calculateStats());
    setIsLoading(false);
  }, [activities]); // Recalculate when activities change

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-8 p-8"
    >
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome to Admin Dashboard 👋
        </h1>
        <p className="text-gray-400 mt-2">
          Manage certificates and monitor system activity
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-3 text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
          </div>
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="p-6 bg-[#110C1D] border-white/10 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  {stat.trend === "up" ? (
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="bg-red-500/10 p-2 rounded-full">
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.title}</p>
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm font-medium",
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  )}
                >
                  {stat.change} from last month
                </p>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Upload Certificates",
              description: "Add new certificates to the system",
              icon: Upload,
              href: "/admin/dashboard/upload",
              color: "blue",
            },
            {
              title: "Download Reports",
              description: "Generate and download reports",
              icon: Download,
              href: "/admin/dashboard/reports",
              color: "blue",
            },
            {
              title: "Manage Users",
              description: "Add or remove user access",
              icon: Users,
              href: "/admin/dashboard/users",
              color: "blue",
            },
            {
              title: "Settings",
              description: "Configure system settings",
              icon: Settings,
              href: "/admin/dashboard/settings",
              color: "blue",
            },
          ].map((action, index) => (
            <motion.div
              key={action.title}
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href={action.href}>
                <Card className="p-6 space-y-4 bg-[#110C1D] border-white/10 hover:border-rose-500/50 transition-colors">
                  <div
                    className={`bg-${action.color}-500/10 w-12 h-12 rounded-full flex items-center justify-center`}
                  >
                    <action.icon
                      className={`h-6 w-6 text-${action.color}-500`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {action.description}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="p-6 bg-[#110C1D] border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0"
                >
                  <div className="bg-blue-500/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">
                        {activity.action}
                      </p>
                      <time className="text-sm text-gray-400">
                        {activity.time}
                      </time>
                    </div>
                    <p className="text-sm text-gray-400">by {activity.user}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
