"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Mock data - In a real app, this would come from your backend
const reports = [
  {
    id: 1,
    name: "Monthly Certificates Report",
    description: "Summary of certificates issued in the last month",
    type: "Excel",
    lastGenerated: "2024-03-08",
    data: [
      ["Certificate ID", "Student Name", "Issue Date", "Status"],
      ["CERT001", "John Doe", "2024-03-01", "Issued"],
      ["CERT002", "Jane Smith", "2024-03-02", "Pending"],
      ["CERT003", "Mike Johnson", "2024-03-03", "Issued"],
    ],
  },
  {
    id: 2,
    name: "User Activity Report",
    description: "Details of user interactions and downloads",
    type: "Excel",
    lastGenerated: "2024-03-07",
    data: [
      ["User ID", "Name", "Action", "Date"],
      ["USR001", "John Doe", "Download Certificate", "2024-03-01"],
      ["USR002", "Jane Smith", "View Certificate", "2024-03-02"],
      ["USR003", "Mike Johnson", "Request Certificate", "2024-03-03"],
    ],
  },
  {
    id: 3,
    name: "Certificate Analytics",
    description: "Analytics and trends of certificate issuance",
    type: "Excel",
    lastGenerated: "2024-03-06",
    data: [
      ["Month", "Certificates Issued", "Downloads", "Active Users"],
      ["January", "150", "300", "450"],
      ["February", "180", "360", "520"],
      ["March", "210", "420", "600"],
    ],
  },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<number | null>(null);
  const { toast } = useToast();

  const convertToCSV = (data: string[][]) => {
    return data.map(row => row.join(',')).join('\\n');
  };

  const downloadReport = async (report: typeof reports[0]) => {
    setGenerating(report.id);

    try {
      // Simulate report generation delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Convert data to CSV format
      const csv = convertToCSV(report.data);
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Report downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Download Reports</h2>
        <p className="text-muted-foreground">
          Generate and download system reports
        </p>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Generated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    {report.name}
                  </div>
                </TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.lastGenerated}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => downloadReport(report)}
                    disabled={generating === report.id}
                  >
                    {generating === report.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
