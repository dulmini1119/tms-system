"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
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
import { toast } from "sonner";


interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  position: string;
  department?: string;
  business_unit?: string;
  status: string;
  last_login: string | null;
  employee_id: string;
}

interface Role {
  id: string;
  name: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    employee_id: "",
    password: "",
  });

  // --- ADDED: Helper function to get authentication headers ---
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

  // --- END OF ADDED SECTION ---

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/users", {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(`Failed to fetch users: ${text}`);
        setUsers([]);
        return;
      }

      const data = await res.json();
      const usersArray: User[] = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data.data)
        ? data.data
        : [];

      setUsers(usersArray);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch Roles */
  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/roles", {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        console.error("Failed to fetch roles:", res.status, await res.text());
        toast.error("Failed to load roles");
        return;
      }

      const response = await res.json();

      // Use response.data instead of response directly
      const rolesArray = Array.isArray(response.data) ? response.data : [];
      if (rolesArray.length === 0) {
        console.warn("Roles array is empty or invalid", response);
      }

      setRoles(rolesArray);
    } catch (err) {
      console.error("Failed to load roles", err);
      toast.error("Failed to load roles");
    }
  }, []);

  /** Fetch Users */
  useEffect(() => {
    Promise.all([fetchUsers(), fetchRoles()]);
  }, [fetchUsers, fetchRoles]);

  const validateForm = () => {
    const { first_name, last_name, email, position, employee_id, password } =
      formData;
    if (!first_name.trim()) return "First name is required";
    if (!last_name.trim()) return "Last name is required";
    if (!email.trim()) return "Email is required";
    if (!position.trim()) return "Role is required";
    if (!employee_id.trim()) return "Employee ID is required";
    if (!editingUser && !password.trim()) return "Password is required";
    return null;
  };

  /** Create / Update User */
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const url = editingUser ? `/users/${editingUser.id}` : "/users";
    const method = editingUser ? "PUT" : "POST";

    const payload = editingUser
    ? {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        position: formData.position,
        employee_id: formData.employee_id,
      }
    : {
        ...formData,
        phone: formData.phone || null,
      };

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(), // <--- FIX
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || result.error || "Request failed");
      }

      toast.success(editingUser ? "User updated" : "User created");

      await fetchUsers();
      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      console.log(err);

      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally{
      setLoading(false);
    }
  };

  /** Delete User */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;

    try {
      const res = await fetch(`/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(), // <--- FIX
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  /** Reset Password */
  const handleResetPassword = async (email: string) => {
    try {
      const res = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, // <--- FIX
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed");
      }
        

      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      position: "",
      employee_id: "",
      password: "",
    });
  };

  /** Edit Dialog */
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || "",
      position: user.position,
      employee_id: user.employee_id,
      password: "",
    });
    setIsDialogOpen(true);
  };

  /** Create Dialog */
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  /** Filtering */
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all-roles" || user.position === roleFilter;

    const matchesStatus =
      statusFilter === "all-status" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => (
    <Badge variant={status === "Active" ? "default" : "secondary"}>
      {status}
    </Badge>
  );

  /** Loading Screen */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="p-3">
          <h1 className="text-2xl">USER MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">
            Manage users, their roles, and access permissions
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {/* TABLE CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all users in your organization
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* FILTERS */}
          <div className="flex flex-col gap-4 mb-6 lg:flex-row">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TABLE (DESKTOP) */}
          <div className="hidden lg:block overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone || "-"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{user.position}</Badge>
                    </TableCell>

                    <TableCell>{user.employee_id}</TableCell>

                    <TableCell>{getStatusBadge(user.status)}</TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "Never"}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleResetPassword(user.email)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                            Password
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border rounded-xl p-4 bg-card shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                  <Badge variant="outline">{user.position}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {user.phone || "No phone"}
                  </div>
                  <div>Employee ID: {user.employee_id}</div>
                  <div className="flex items-center justify-between">
                    <span>Status: {getStatusBadge(user.status)}</span>
                    <span className="text-muted-foreground text-xs">
                      Last login:{" "}
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit User
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleResetPassword(user.email)}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Password
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user details below"
                : "Fill in the details to create a new user"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {[
              ["First Name", "first_name"],
              ["Last Name", "last_name"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["Employee ID", "employee_id"],
            ].map(([label, key]) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{label}</Label>
                <Input
                  className="col-span-3"
                  value={formData[key as keyof typeof formData]}
                  type={key === "email" ? "email" : "text"}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Role</Label>
              <Select
                value={formData.position}
                onValueChange={(v) => setFormData({ ...formData, position: v })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Password</Label>
                <Input
                  type="password"
                  className="col-span-3"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
