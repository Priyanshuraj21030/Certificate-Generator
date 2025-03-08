"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  User,
  Calendar,
  Mail,
  FileCheck,
  LogOut,
  Award,
  Clock,
  ArrowLeft,
  Share2,
  Eye,
  CheckCircle2,
  BadgeCheck,
  GraduationCap,
  BookOpen,
  Linkedin,
  Share,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Certificate from "@/components/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Certificate {
  id: string;
  userId: number;
  templateId: string;
  studentName: string;
  registrationNumber: string;
  eventName: string;
  eventType: string;
  issueDate: string;
  courseName: string;
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

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentStudent = localStorage.getItem("currentStudent");
    if (!currentStudent) {
      router.push("/login");
      return;
    }

    const studentData = JSON.parse(currentStudent);
    setUser(studentData);

    // Get or create certificate for this user
    const savedCertificates = localStorage.getItem("certificates");
    let certificates = savedCertificates ? JSON.parse(savedCertificates) : [];

    let userCertificate = certificates.find(
      (cert: Certificate) => cert.userId === studentData.id
    );

    // If no certificate exists for this user, create one
    if (!userCertificate) {
      userCertificate = {
        id: `cert-${studentData.id}`,
        userId: studentData.id,
        templateId: "default", // Using default template
        studentName: studentData.name,
        registrationNumber: studentData.regNumber,
        eventName: "GeeksforGeeks Technical Workshop on Web Development",
        eventType: "Technical Workshop",
        issueDate: studentData.joinedDate,
        courseName: "Web Development", // Add default course name
      };

      certificates.push(userCertificate);
      localStorage.setItem("certificates", JSON.stringify(certificates));
    }

    setCertificate(userCertificate);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentStudent");
    router.push("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDownloadCertificate = async () => {
    if (!certificate) {
      toast({
        title: "Error",
        description: "Certificate not found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);

      // Get the certificate element
      const certificateElement = document.getElementById("certificate");
      if (!certificateElement) {
        toast({
          title: "Error",
          description:
            "Certificate element not found on the page. Please refresh and try again.",
          variant: "destructive",
        });
        return;
      }

      // Generate PDF with better quality settings
      const canvas = await html2canvas(certificateElement, {
        scale: 3, // Increased scale for better quality
        backgroundColor: "#ffffff",
        logging: false, // Disable logging
        useCORS: true, // Enable CORS for images
        allowTaint: true,
      }).catch((error) => {
        console.error("Error generating canvas:", error);
        throw new Error("Failed to generate certificate image");
      });

      // Calculate dimensions
      const pageWidth = 297; // A4 width in mm
      const pageHeight = 210; // A4 height in mm
      const imgRatio = canvas.width / canvas.height;
      let imgWidth = pageWidth;
      let imgHeight = pageWidth / imgRatio;

      // If height exceeds page height, scale down
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = pageHeight * imgRatio;
      }

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      try {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [pageWidth, pageHeight],
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${certificate.studentName.replace(
          /\s+/g,
          "_"
        )}_certificate_${timestamp}.pdf`;

        // Save the PDF
        pdf.save(filename);

        // Update user's download status
        if (user) {
          const updatedUser = { ...user, hasDownloadedCertificate: true };
          setUser(updatedUser);

          // Update in localStorage
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const updatedUsers = users.map((u: User) =>
            u.id === user.id ? { ...u, hasDownloadedCertificate: true } : u
          );
          localStorage.setItem("users", JSON.stringify(updatedUsers));
          localStorage.setItem("currentStudent", JSON.stringify(updatedUser));
        }

        toast({
          title: "Success!",
          description: "Your certificate has been downloaded successfully.",
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF file");
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Download Failed",
        description:
          "There was an error downloading your certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (platform: "whatsapp" | "linkedin") => {
    if (!certificate) return;

    const certificateUrl =
      window.location.origin + `/certificates/${certificate.id}`;
    const text = `Check out my Professional Web Development Certificate from our program! 🎓`;

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + "\n" + certificateUrl
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          certificateUrl
        )}&title=${encodeURIComponent(text)}`;
        break;
    }

    // Open share URL in a new window
    window.open(shareUrl, "_blank");

    toast({
      title: "Share Link Generated",
      description: `Certificate sharing link for ${platform} has been opened.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0118]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0118]">
        <p className="text-gray-400">Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0118]">
      {/* Header */}
      <div className="bg-[#110C1D]/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                <div
                  className={`h-2 w-2 rounded-full ${
                    user.status === "Active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-300">{user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-400 mt-2">
            View and manage your certificate here
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Section */}
          <motion.div variants={item}>
            <Card className="p-6 space-y-6 bg-[#110C1D] border-white/10 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {user.regNumber}
                    </span>
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-white/10">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Account Status</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          user.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="font-medium text-white">
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Course Progress</p>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium text-white">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      Joined {new Date(user.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      Last Login:{" "}
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "First Time"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Certificate Section */}
          <motion.div variants={item}>
            <Card className="p-6 bg-[#110C1D] border-white/10 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Your Certificate
                  </h2>
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-full">
                  <span className="text-sm text-primary font-medium">
                    {user.hasDownloadedCertificate ? "Downloaded" : "Available"}
                  </span>
                </div>
              </div>

              {certificate ? (
                <div className="space-y-6">
                  <div className="border border-white/10 rounded-xl p-6 space-y-4 bg-[#1A1625]">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg text-white">
                            {certificate.eventName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {user?.hasDownloadedCertificate
                              ? "Event Certificate Downloaded - Click to download again"
                              : "Event Certificate Available for Download"}
                          </p>
                        </div>
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                          {certificate.eventType}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300">
                        Thank you for participating in our event! Your
                        certificate of participation is ready to be downloaded.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        onClick={() => setShowPreview(true)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                      <Button
                        onClick={handleDownloadCertificate}
                        variant="outline"
                        className="flex-1 border-white/10 text-gray-300 hover:text-white hover:bg-primary/10"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="px-3 border-white/10 text-gray-300 hover:text-white"
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1A1625] border-white/10">
                          <DropdownMenuItem
                            className="text-gray-300 hover:text-white cursor-pointer flex items-center gap-2"
                            onClick={() => handleShare("whatsapp")}
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Share on WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-gray-300 hover:text-white cursor-pointer flex items-center gap-2"
                            onClick={() => handleShare("linkedin")}
                          >
                            <Linkedin className="h-4 w-4" />
                            Share on LinkedIn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>
                      Certificate issued on{" "}
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-[#1A1625] rounded-xl">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium text-white">
                    No Event Certificates Available
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Participate in events to receive certificates
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Certificate Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[1200px] w-[95%] bg-[#110C1D] border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-[#110C1D] z-10 py-4 border-b border-white/10">
            <DialogTitle className="text-white">Your Certificate</DialogTitle>
          </DialogHeader>
          {certificate && (
            <div className="p-4">
              <div
                className="relative bg-white rounded-lg shadow-lg p-8"
                id="certificate"
              >
                <Certificate
                  studentName={certificate.studentName}
                  registrationNumber={certificate.registrationNumber}
                  eventName={certificate.eventName}
                  eventType={certificate.eventType}
                  issueDate={certificate.issueDate}
                  courseName={certificate.courseName}
                  isAdmin={false}
                  hideDownloadButton={true}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  onClick={handleDownloadCertificate}
                  className="bg-primary hover:bg-primary/90"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
