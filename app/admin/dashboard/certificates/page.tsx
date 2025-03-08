"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  Download,
  Edit,
  Eye,
  FileUp,
  Palette,
  Plus,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import Certificate from "@/components/Certificate";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface User {
  id: number;
  name: string;
  regNumber: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  hasDownloadedCertificate: boolean;
}

interface CertificateTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  fontFamily: string;
  borderStyle: string;
  watermarkOpacity: string;
  logoPosition: string;
}

interface CertificateData {
  id: string;
  userId: number;
  templateId: string;
  studentName: string;
  registrationNumber: string;
  courseName: string;
  issueDate: string;
}

export default function CertificatesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateData | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CertificateTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Default template
  const defaultTemplate: CertificateTemplate = {
    id: "default",
    name: "Classic Template",
    backgroundColor: "#ffffff",
    borderColor: "#1a365d",
    textColor: "#1a365d",
    fontFamily: "serif",
    borderStyle: "double",
    watermarkOpacity: "0.1",
    logoPosition: "center",
  };

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      setUsers(users);

      // Load or initialize certificates
      const savedCertificates = localStorage.getItem("certificates");
      let existingCertificates: CertificateData[] = savedCertificates
        ? JSON.parse(savedCertificates)
        : [];

      // Create certificates for users who don't have one
      const newCertificates = users
        .filter(
          (user: User) =>
            !existingCertificates.some((cert) => cert.userId === user.id)
        )
        .map((user: User) => ({
          id: Math.floor(Math.random() * 1000000),
          userId: user.id,
          userName: user.name,
          regNumber: user.regNumber,
          issuedDate: new Date().toISOString(),
          downloadUrl: `/certificates/${user.id}.pdf`,
        }));

      if (newCertificates.length > 0) {
        existingCertificates = [...existingCertificates, ...newCertificates];
        localStorage.setItem(
          "certificates",
          JSON.stringify(existingCertificates)
        );
      }

      setCertificates(existingCertificates);
    }

    // Load templates from localStorage or set default
    const savedTemplates = localStorage.getItem("certificateTemplates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      setTemplates([defaultTemplate]);
      localStorage.setItem(
        "certificateTemplates",
        JSON.stringify([defaultTemplate])
      );
    }
  }, []);

  const handleAddTemplate = () => {
    const newTemplate: CertificateTemplate = {
      id: `template-${Date.now()}`,
      name: "New Template",
      backgroundColor: "#ffffff",
      borderColor: "#000000",
      textColor: "#000000",
      fontFamily: "serif",
      borderStyle: "solid",
      watermarkOpacity: "0.1",
      logoPosition: "center",
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem(
      "certificateTemplates",
      JSON.stringify(updatedTemplates)
    );
    setSelectedTemplate(newTemplate);
    setShowTemplateEditor(true);

    toast({
      title: "Template Added",
      description: "New certificate template has been created.",
    });
  };

  const handleUpdateTemplate = (template: CertificateTemplate) => {
    const updatedTemplates = templates.map((t) =>
      t.id === template.id ? template : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem(
      "certificateTemplates",
      JSON.stringify(updatedTemplates)
    );
    setShowTemplateEditor(false);

    toast({
      title: "Template Updated",
      description: "Certificate template has been updated successfully.",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (templates.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "At least one template must remain.",
        variant: "destructive",
      });
      return;
    }

    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem(
      "certificateTemplates",
      JSON.stringify(updatedTemplates)
    );

    toast({
      title: "Template Deleted",
      description: "Certificate template has been deleted.",
    });
  };

  const handlePreview = (certificate: CertificateData) => {
    setSelectedCertificate(certificate);
    setShowPreview(true);
  };

  const handleEditTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateEditor(true);
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Certificate Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowTemplateEditor(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Templates
          </Button>
          <Button onClick={handleAddTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="certificates">
        <TabsList>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell>{certificate.studentName}</TableCell>
                      <TableCell>{certificate.registrationNumber}</TableCell>
                      <TableCell>{certificate.courseName}</TableCell>
                      <TableCell>
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={certificate.templateId}
                          onValueChange={(value) => {
                            const updatedCertificates = certificates.map(
                              (cert) =>
                                cert.id === certificate.id
                                  ? { ...cert, templateId: value }
                                  : cert
                            );
                            setCertificates(updatedCertificates);
                            localStorage.setItem(
                              "certificates",
                              JSON.stringify(updatedCertificates)
                            );
                          }}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(certificate)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 space-y-4"
                  style={{
                    backgroundColor: template.backgroundColor,
                    borderColor: template.borderColor,
                    borderStyle: template.borderStyle,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3
                      className="font-medium"
                      style={{ color: template.textColor }}
                    >
                      {template.name}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="text-sm">
                        Style: {template.borderStyle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileUp className="h-4 w-4" />
                      <span className="text-sm">
                        Font: {template.fontFamily}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Certificate Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <Certificate
              studentName={selectedCertificate.studentName}
              registrationNumber={selectedCertificate.registrationNumber}
              courseName={selectedCertificate.courseName}
              issueDate={selectedCertificate.issueDate}
              isAdmin={true}
              template={
                templates.find(
                  (t) => t.id === selectedCertificate.templateId
                ) || defaultTemplate
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Template Editor Dialog */}
      <Dialog open={showTemplateEditor} onOpenChange={setShowTemplateEditor}>
        <DialogContent className="max-w-[600px] w-full">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={selectedTemplate.name}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={selectedTemplate.backgroundColor}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        backgroundColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Border Color</Label>
                  <Input
                    type="color"
                    value={selectedTemplate.borderColor}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        borderColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={selectedTemplate.textColor}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        textColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={selectedTemplate.fontFamily}
                    onValueChange={(value) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        fontFamily: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="sans-serif">Sans Serif</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                      <SelectItem value="cursive">Cursive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Border Style</Label>
                  <Select
                    value={selectedTemplate.borderStyle}
                    onValueChange={(value) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        borderStyle: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Watermark Opacity</Label>
                  <Input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.1"
                    value={selectedTemplate.watermarkOpacity}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        watermarkOpacity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateEditor(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateTemplate(selectedTemplate)}>
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
