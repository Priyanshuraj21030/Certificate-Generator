"use client";

import React from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Award, Medal, CheckCircle2 } from "lucide-react";

interface CertificateProps {
  studentName: string;
  registrationNumber: string;
  eventName: string;
  issueDate: string;
  isAdmin: boolean;
  hideDownloadButton?: boolean;
  eventType?: string;
  template?: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    fontFamily: string;
    borderStyle: string;
    watermarkOpacity: string;
    logoPosition: string;
  };
}

export default function Certificate({
  studentName,
  registrationNumber,
  eventName,
  eventType = "Technical Workshop",
  issueDate,
  isAdmin,
  hideDownloadButton = false,
  template = {
    backgroundColor: "#ffffff",
    borderColor: "#1a365d",
    textColor: "#1a365d",
    fontFamily: "serif",
    borderStyle: "double",
    watermarkOpacity: "0.1",
    logoPosition: "center",
  },
}: CertificateProps) {
  // Generate a unique ID for this certificate instance
  const certificateId = React.useId();

  const handleEdit = (field: string, value: string) => {
    if (isAdmin && onEdit) {
      onEdit(field, value);
    }
  };

  const downloadAsPDF = async () => {
    const certificate = document.getElementById("certificate");
    if (!certificate) return;

    try {
      const canvas = await html2canvas(certificate, {
        scale: 2,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${studentName.replace(/\s+/g, "_")}_certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="relative" id={`certificate-${certificateId}`}>
      <div
        className="relative p-16 rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: template.backgroundColor,
          border: `4px ${template.borderStyle} ${template.borderColor}`,
          fontFamily: template.fontFamily,
          color: template.textColor,
          minHeight: "600px",
          width: "100%",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0" style={{ opacity: 0.03 }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#6366F1_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#A855F7_0%,_transparent_30%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#3B82F6_0%,_transparent_30%)]"></div>
        </div>

        {/* Corner Decorations */}
        <div
          className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 rounded-tl-lg"
          style={{ borderColor: template.borderColor }}
        ></div>
        <div
          className="absolute top-0 right-0 w-24 h-24 border-r-4 border-t-4 rounded-tr-lg"
          style={{ borderColor: template.borderColor }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 rounded-bl-lg"
          style={{ borderColor: template.borderColor }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 rounded-br-lg"
          style={{ borderColor: template.borderColor }}
        ></div>

        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: template.watermarkOpacity }}
        >
          <Medal className="w-96 h-96 rotate-12" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Award className="w-16 h-16" />
            <div className="text-left">
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">
                {eventType}
              </h4>
              <div
                className="h-0.5 w-12 mt-1"
                style={{ backgroundColor: template.borderColor }}
              ></div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1
              className="text-5xl font-bold mb-2"
              style={{
                background: "linear-gradient(45deg, #1a365d, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Certificate of Participation
            </h1>
            <div className="flex items-center justify-center gap-2 text-xl">
              <span
                className="w-12 h-0.5"
                style={{ backgroundColor: template.borderColor }}
              ></span>
              <p>This is to certify that</p>
              <span
                className="w-12 h-0.5"
                style={{ backgroundColor: template.borderColor }}
              ></span>
            </div>
          </div>

          {/* Student Details */}
          <div className="space-y-6 my-8">
            <h2
              className="text-4xl font-bold"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {studentName}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-xl">
                Registration Number: {registrationNumber}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4 max-w-2xl">
            <p className="text-xl italic">
              has actively participated in
            </p>
            <h3 className="text-3xl font-bold">{eventName}</h3>
            <p className="text-lg opacity-80">
              demonstrating keen interest and valuable contribution throughout the event
            </p>
          </div>

          {/* Footer */}
          <div className="mt-16 w-full">
            <p className="text-lg mb-8">
              Event Date:{" "}
              {new Date(issueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="flex justify-between items-end gap-12 px-12">
              <div className="text-center flex-1">
                <div
                  className="border-t-2 pt-2"
                  style={{ borderColor: template.borderColor }}
                >
                  <p className="font-semibold text-lg">Event Organizer</p>
                  <p className="text-sm opacity-70">
                    Technical Events Department
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 relative">
                  <Medal className="w-full h-full opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm font-mono">VERIFIED</p>
                  </div>
                </div>
              </div>
              <div className="text-center flex-1">
                <div
                  className="border-t-2 pt-2"
                  style={{ borderColor: template.borderColor }}
                >
                  <p className="font-semibold text-lg">
                    Head of Department
                  </p>
                  <p className="text-sm opacity-70">Event Authority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button - Only show in preview, not in certificate */}
      {!isAdmin && !hideDownloadButton && (
        <motion.button
          onClick={downloadAsPDF}
          className="mt-6 px-8 py-4 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-3 mx-auto text-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Your Certificate
        </motion.button>
      )}
    </div>
  );
}
