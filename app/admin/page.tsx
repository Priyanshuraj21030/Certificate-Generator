"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { validateAdminCredentials, setAdminUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { isValid, user } = await validateAdminCredentials(
        formData.username,
        formData.password
      );

      if (isValid && user) {
        setAdminUser(user);
        toast({
          title: "Welcome back!",
          description: `Signed in as ${user.name} (${user.role})`,
        });
        router.push("/admin/dashboard");
      } else {
        setError("Invalid username or password");
        toast({
          title: "Access Denied",
          description:
            "Only administrators and authorized teachers can access this portal.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0118]">
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

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="absolute top-4 left-4 md:top-8 md:left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-[#110C1D] border-white/10">
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-blue-500/10 p-4 rounded-full">
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Admin Portal
                </h1>
                <p className="text-gray-400">
                  Sign in with your administrator or teacher account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-200"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="w-full px-3 py-2 bg-[#1A1625] border border-white/10 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-200"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#1A1625] border border-white/10 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="w-full flex flex-col items-center gap-4 text-sm">
                <div className="w-full border-t border-white/10"></div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-400">
                    Having trouble signing in?
                  </p>
                  <a
                    href="mailto:priyanshiraj21030@gmail.com?subject=Support Request - Admin Login"
                    className="text-sm text-primary hover:text-primary/80 transition-colors inline-block"
                  >
                    Contact support
                  </a>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  This is a secure area. Only authorized administrators and
                  teachers can access this portal.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
