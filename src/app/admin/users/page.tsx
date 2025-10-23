"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
  businessUnit: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "078 7654346",
    role: "Admin",
    department: "IT",
    businessUnit: "Technology",
    status: "Active",
    lastLogin: "2024-01-15 10:30 AM",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "076 5432111",
    role: "Manager",
    department: "Marketing",
    businessUnit: "Sales & Marketing",
    status: "Active",
    lastLogin: "2024-01-15 09:15 AM"
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    phone: "076 5143212",
    role: "Employee",
    department: "HR",
    businessUnit: "Administration",
    status: "Inactive",
    lastLogin: "2024-01-12 03:45 PM"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "076 5043213",
    role: "Employee",
    department: "Finance",
    businessUnit: "Finance",
    status: "Active",
    lastLogin: "2024-01-15 08:20 AM"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    phone: "076 5143214",
    role: "Driver",
    department: "Operations",
    businessUnit: "Operations",
    status: "Active",
    lastLogin: "2024-01-15 07:00 AM"
  }
];

const roles = ["Admin", "Manager", "Employee", "Driver", "HOD"];
const departments = ["IT", "Marketing", "HR", "Finance", "Operations"];
const businessUnits = ["Technology", "Sales & Marketing", "Administration", "Finance", "Operations"];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [departmentFilter, setDepartmentFilter] = useState("all-departments");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    businessUnit: "",
    status: "Active",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: keyof User) => {
    if (typeof e === "string") {
      // Handle Select component changes
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else {
      // Handle Input component changes
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  // Handle form submission for creating or updating a user
  const handleSubmit = () => {
    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        id: users.length + 1, // Simple ID generation (replace with UUID or backend-generated ID)
        lastLogin: new Date().toLocaleString(),
        ...formData,
      } as User;
      setUsers((prev) => [...prev, newUser]);
    }
    setIsDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      businessUnit: "",
      status: "Active",
    });
  };

  // Handle editing a user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };

  // Handle creating a new user
  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      businessUnit: "",
      status: "Active",
    });
    setIsDialogOpen(true);
  };

  // Handle deactivating a user
  const handleDeactivateUser = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "Inactive" } : user
      )
    );
  };

  // Handle resetting a user's password
  const handleResetPassword = (userId: number) => {
    // Simulate password reset (replace with actual API call)
    console.log(`Resetting password for user ID: ${userId}`);
    alert(`Password reset initiated for user ID: ${userId}`);
    // Example API call:
    // fetch(`/api/users/${userId}/reset-password`, { method: "POST" })
    //   .then((res) => res.json())
    //   .then(() => alert("Password reset email sent"));
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all-roles" || user.role === roleFilter) &&
      (departmentFilter === "all-departments" || user.department === departmentFilter) &&
      (statusFilter === "all-status" || user.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "Active" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 space-x-4">
      <div className="flex items-center justify-between">
        <div className="p-3">
          <h1 className="text-2xl">USER MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">
            Manage users, their roles, and access permissions
          </p>
        </div>
        <Button onClick={handleCreateUser} className="hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-departments">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Business Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.businessUnit}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user information and settings"
                : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange(e, "name")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange(e, "email")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange(e, "phone")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role || ""}
                onValueChange={(value) => handleChange(value, "role")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select
                value={formData.department || ""}
                onValueChange={(value) => handleChange(value, "department")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessUnit" className="text-right">
                Business Unit
              </Label>
              <Select
                value={formData.businessUnit || ""}
                onValueChange={(value) => handleChange(value, "businessUnit")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a business unit" />
                </SelectTrigger>
                <SelectContent>
                  {businessUnits.map((bu) => (
                    <SelectItem key={bu} value={bu}>
                      {bu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}