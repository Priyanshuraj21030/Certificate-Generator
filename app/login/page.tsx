"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.1,
    transition: {
      duration: 1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const inputVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1, transition: { duration: 0.2 } },
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    regNumber: "",
    password: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get users from localStorage
      const savedUsers = localStorage.getItem("users");
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

      // Find user with matching registration number
      const user = users.find((u) => u.regNumber === formData.regNumber);

      if (user && user.password === formData.password) {
        // Update user's login status and last login time
        const updatedUsers = users.map((u) => {
          if (u.id === user.id) {
            return {
              ...u,
              lastLogin: new Date().toISOString(),
              status: "Active",
            };
          }
          return u;
        });

        // Save updated users back to localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        toast({
          title: "Success!",
          description: "Logged in successfully.",
        });

        // Store user info in localStorage for the student portal
        localStorage.setItem("currentStudent", JSON.stringify(user));

        // Redirect to student dashboard
        router.push("/student/dashboard");
      } else {
        toast({
          title: "Error!",
          description: "Invalid registration number or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0A0118]">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#6366F1_0%,_transparent_50%)]"
          variants={backgroundVariants}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#A855F7_0%,_transparent_30%)]"
          variants={backgroundVariants}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#3B82F6_0%,_transparent_30%)]"
          variants={backgroundVariants}
        />
      </motion.div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="absolute top-4 left-4 md:top-8 md:left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-primary transition-colors bg-white/5 px-4 py-2 rounded-full hover:bg-white/10"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
            </motion.div>
            Back to home
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="max-w-md w-full p-8 space-y-8 bg-[#110C1D] border-white/10 shadow-xl backdrop-blur-sm hover:border-white/20 transition-colors">
            <motion.div className="space-y-2 text-center" variants={fadeIn}>
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="bg-primary/10 p-4 rounded-full relative group">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-primary/5 rounded-full"
                  />
                  <GraduationCap className="h-8 w-8 text-primary relative z-10" />
                </div>
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-white"
                variants={fadeIn}
              >
                Welcome Back
              </motion.h1>
              <motion.p className="text-gray-400" variants={fadeIn}>
                Sign in to access your event certificates
              </motion.p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={fadeIn}
            >
              <div className="space-y-4">
                <motion.div
                  className="space-y-2"
                  variants={fadeIn}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Label htmlFor="regNumber" className="text-gray-200">
                    Registration Number
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="regNumber"
                      placeholder="Enter your registration number"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/50 transition-all duration-300"
                      required
                      disabled={loading}
                      value={formData.regNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, regNumber: e.target.value })
                      }
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={fadeIn}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/50 transition-all duration-300"
                      required
                      disabled={loading}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white transition-all duration-300"
                  disabled={loading}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                        Signing in...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="sign-in"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sign in
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.form>

            <motion.div className="space-y-4" variants={fadeIn}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#110C1D] px-2 text-gray-400">Or</span>
                </div>
              </div>

              <motion.div
                className="text-center space-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-gray-400">
                  Having trouble signing in?
                </p>
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-primary/80 transition-colors inline-block"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Contact support
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
