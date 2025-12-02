"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, RefreshCw, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  position: string;
  employee_id: string;
  status: string;
  last_login: string | null;
}

interface Role {
  name: string;
  id: string;
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    employeeId: "",
    password: "",
  });

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (searchTerm) query.append("search", searchTerm);
      if (roleFilter !== "all-roles") query.append("role", roleFilter);
      if (statusFilter !== "all-status") query.append("status", statusFilter);

      const res = await fetch(`/users?${query.toString()}`, { headers: getAuthHeaders() });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const messages = Object.values(data.details).join(", ");
          return toast.error(messages);
        }
        return toast.error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/roles", { headers: getAuthHeaders() });
      const data = await res.json();

      if (!res.ok) return toast.error("Failed to fetch roles");
      setRoles(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch roles");
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First Name is required";
    if (!formData.lastName.trim()) return "Last Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.role.trim()) return "Role is required";
    if (!formData.employeeId.trim()) return "Employee ID is required";
    if (!editingUser && !formData.password.trim()) return "Password is required";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const url = editingUser ? `/users/${editingUser.id}` : "/users";
    const method = editingUser ? "PUT" : "POST";

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      role: formData.role,
      employeeId: formData.employeeId,
      password: editingUser ? undefined : formData.password,
    };

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const messages = Object.values(data.details).join(", ");
          return toast.error(messages);
        }
        return toast.error(data.message || "Something went wrong");
      }

      toast.success(editingUser ? "User updated" : "User created");
      fetchUsers();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      const res = await fetch(`/users/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error(await res.text());
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const res = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", role: "", employeeId: "", password: "" });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone || "",
      role: user.position,
      employeeId: user.employee_id,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all-roles" || u.position === roleFilter;
    const matchesStatus = statusFilter === "all-status" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => (
    <Badge variant={status.toLowerCase() === "active" ? "default" : "secondary"}>{status}</Badge>
  );

  if (loading) return <div className="flex items-center justify-center h-64">Loading users...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="p-3">
          <h1 className="text-2xl">USER MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">Manage users, their roles, and access permissions</p>
        </div>
        <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Add User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users in your organization</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 mb-6 lg:flex-row">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
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
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                {filteredUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.first_name} {u.last_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1"><Mail className="h-3 w-3 mr-1" />{u.email}</div>
                    </TableCell>
                    <TableCell><div className="text-sm flex items-center"><Phone className="h-3 w-3 mr-1" />{u.phone || "-"}</div></TableCell>
                    <TableCell><Badge variant="outline">{u.position}</Badge></TableCell>
                    <TableCell>{u.employee_id}</TableCell>
                    <TableCell>{getStatusBadge(u.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.last_login ? new Date(u.last_login).toLocaleString() : "Never"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(u)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(u.email)}><RefreshCw className="mr-2 h-4 w-4" /> Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(u.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>{editingUser ? "Update user details" : "Fill details to create a user"}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {[["First Name", "firstName"], ["Last Name", "lastName"], ["Email", "email"], ["Phone", "phone"], ["Employee ID", "employeeId"]].map(([label, key]) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{label}</Label>
                <Input className="col-span-3" value={formData[key as keyof typeof formData]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
              </div>
            ))}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Role</Label>
              <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Password</Label>
                <Input type="password" className="col-span-3" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>{editingUser ? "Update User" : "Create User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
