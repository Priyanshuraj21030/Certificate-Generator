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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Edit,
  Trash2,
  Mail,
  User,
  Upload,
  FileSpreadsheet,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  FileDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useActivity } from "@/lib/activity-context";

// Mock data - In a real app, this would come from your backend
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Student",
    status: "Inactive",
    joinedDate: "2024-01-15",
    regNumber: "2024001",
    password: "JohnDoe123", // In real app, this would be hashed
    lastLogin: null,
    hasDownloadedCertificate: false,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Student",
    status: "Inactive",
    joinedDate: "2024-02-01",
    regNumber: "2024002",
    password: "JaneSmith123",
    lastLogin: null,
    hasDownloadedCertificate: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Teacher",
    status: "Active",
    joinedDate: "2024-02-15",
    regNumber: "T2024001",
    password: "MikeJohnson123",
    lastLogin: null,
    hasDownloadedCertificate: false,
  },
];

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

export default function UsersPage() {
  // Initialize with initialUsers, then update from localStorage in useEffect
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from localStorage on client-side only
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    setIsLoading(false);
  }, []);

  // Update localStorage whenever users change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users, isLoading]);

  // Replace updateUsers function with direct setUsers
  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
  };

  const { toast } = useToast();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Student",
    regNumber: "",
    password: "",
  });
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [csvData, setCSVData] = useState<string[][]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { addActivity } = useActivity();

  // Generate a random password
  const generatePassword = (name: string) => {
    const base = name.replace(/\s+/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${base}${randomNum}`;
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleAddUser = () => {
    const id = users.length + 1;
    const password = generatePassword(newUser.name);
    const newUserData = {
      id,
      ...newUser,
      password,
      status: newUser.role === "Teacher" ? "Active" : "Inactive",
      joinedDate: new Date().toISOString().split("T")[0],
      lastLogin: null,
      hasDownloadedCertificate: false,
    };

    updateUsers([...users, newUserData]);
    setNewUser({
      name: "",
      email: "",
      role: "Student",
      regNumber: "",
      password: "",
    });
    setSelectedUser(newUserData);
    setShowCredentialsDialog(true);

    // Add activity
    addActivity("New User Added", `${newUserData.name} (${newUserData.role})`);

    toast({
      title: "Success!",
      description: "User added successfully.",
    });
  };

  const handleDeleteUser = (userId: number) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (userToDelete) {
      updateUsers(users.filter((user) => user.id !== userId));
      addActivity(
        "User Deleted",
        `${userToDelete.name} (${userToDelete.role})`
      );
    }

    toast({
      title: "Success!",
      description: "User deleted successfully.",
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split("\\n").map((row) => row.split(","));
        setCSVData(rows);
        setShowCSVDialog(true);
      };
      reader.readAsText(file);
    }
  };

  const handleImportCSV = () => {
    // Skip header row and process data
    const newUsers = csvData.slice(1).map((row, index) => {
      const name = row[0]?.trim() || "";
      return {
        id: users.length + index + 1,
        name,
        email: row[1]?.trim() || "",
        regNumber: row[2]?.trim() || "",
        role: "Student",
        status: "Inactive",
        joinedDate: new Date().toISOString().split("T")[0],
        password: generatePassword(name),
        lastLogin: null,
        hasDownloadedCertificate: false,
      };
    });

    updateUsers([...users, ...newUsers]);
    setShowCSVDialog(false);
    setSelectedUser(newUsers[0]);
    setShowCredentialsDialog(true);
    setCSVData([]);

    // Add activity
    addActivity(
      "Users Imported",
      `${newUsers.length} new users imported via CSV`
    );

    toast({
      title: "Success!",
      description: `${newUsers.length} students imported successfully.`,
    });
  };

  const resetPassword = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const newPassword = generatePassword(user.name);
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, password: newPassword } : u
      );
      updateUsers(updatedUsers);
      setSelectedUser({ ...user, password: newPassword });
      setShowCredentialsDialog(true);

      // Add activity
      addActivity("Password Reset", `Password reset for ${user.name}`);

      toast({
        title: "Password Reset",
        description: "New password generated successfully.",
      });
    }
  };

  const downloadCSVTemplate = () => {
    const template =
      "Name,Email,Registration Number\\nJohn Doe,john@example.com,2024001\\n";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditDialog(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    updateUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    );

    // Add activity
    addActivity("User Updated", `Profile updated for ${editingUser.name}`);

    setShowEditDialog(false);
    setEditingUser(null);

    toast({
      title: "Success!",
      description: "User updated successfully.",
    });
  };

  const downloadUserCredentials = () => {
    // Create CSV header with proper formatting
    const headers = [
      "Name",
      "Registration Number",
      "Password",
      "Email",
      "Role",
      "Status",
      "Last Login",
      "Certificate Status",
    ].join(",");

    // Convert users data to CSV format with proper row formatting
    const rows = users.map((user) =>
      [
        `"${user.name}"`, // Wrap name in quotes to handle names with commas
        `"${user.regNumber}"`,
        `"${user.password}"`,
        `"${user.email}"`,
        `"${user.role}"`,
        `"${user.status}"`,
        `"${
          user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : "Never"
        }"`,
        `"${user.hasDownloadedCertificate ? "Downloaded" : "Not Downloaded"}"`,
      ].join(",")
    );

    // Combine headers and rows with proper line breaks
    const csvContent = [headers, ...rows].join("\r\n");

    // Create blob with UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF"; // Add BOM for Excel to properly detect UTF-8
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `user_credentials_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success!",
      description:
        "User credentials downloaded successfully. The file will open properly in Excel or other spreadsheet applications.",
    });
  };

  const simulateUserLogin = (userId: number) => {
    updateUsers(
      users.map((user) => {
        if (user.id === userId) {
          addActivity(
            "User Login",
            `${user.name} logged in for the first time`
          );
          return {
            ...user,
            lastLogin: new Date().toISOString(),
            status: "Active",
          };
        }
        return user;
      })
    );
  };

  const simulateCertificateDownload = (userId: number) => {
    updateUsers(
      users.map((user) => {
        if (user.id === userId) {
          addActivity(
            "Certificate Downloaded",
            `${user.name} downloaded their certificate`
          );
          return {
            ...user,
            hasDownloadedCertificate: true,
            status: "Active",
          };
        }
        return user;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove user access
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={downloadUserCredentials}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Credentials
          </Button>
          <Button variant="outline" onClick={downloadCSVTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csvUpload"
            />
            <Button asChild>
              <label htmlFor="csvUpload" className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import CSV
              </label>
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      placeholder="Enter name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input
                    id="regNumber"
                    placeholder="Enter registration number"
                    value={newUser.regNumber}
                    onChange={(e) =>
                      setNewUser({ ...newUser, regNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>
                <Button className="w-full" onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* CSV Preview Dialog */}
      <Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Import Data</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.slice(1).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell>{row[1]}</TableCell>
                    <TableCell>{row[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowCSVDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportCSV}>Import Students</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog */}
      <Dialog
        open={showCredentialsDialog}
        onOpenChange={setShowCredentialsDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">
                Please save these credentials:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Username:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background rounded px-2 py-1">
                      {selectedUser?.regNumber}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(selectedUser?.regNumber || "")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Password:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background rounded px-2 py-1">
                      {showPassword ? selectedUser?.password : "••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(selectedUser?.password || "")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowCredentialsDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <Input
                  id="edit-name"
                  placeholder="Enter name"
                  value={editingUser?.name || ""}
                  onChange={(e) =>
                    setEditingUser((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email"
                  value={editingUser?.email || ""}
                  onChange={(e) =>
                    setEditingUser((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-regNumber">Registration Number</Label>
              <Input
                id="edit-regNumber"
                placeholder="Enter registration number"
                value={editingUser?.regNumber || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, regNumber: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingUser?.role || "Student"}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, role: e.target.value } : null
                  )
                }
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingUser?.status || "Active"}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, status: e.target.value } : null
                  )
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registration Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.regNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {user.hasDownloadedCertificate ? (
                      <span className="text-green-600">Downloaded</span>
                    ) : (
                      <span className="text-gray-400">Not Downloaded</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resetPassword(user.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
