"use client"
import React, { useState } from 'react';

import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Roles {
  id: number;
  name: string;
  description: string;
  userCount:number;
  createdAt: string;
}

const initialRole : Roles[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access with all administrative privileges",
    userCount: 3,
  
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Manager",
    description: "Department-level management with approval rights",
    userCount: 12,
    //permissions: ["trip_approval", "user_view", "vehicle_view", "reports"],
    createdAt: "2024-01-01"
  },
  {
    id: 3,
    name: "Employee",
    description: "Standard user with trip request capabilities",
    userCount: 156,
    //permissions: ["trip_request", "profile_edit", "trip_view"],
    createdAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Driver",
    description: "Driver-specific access for trip execution",
    userCount: 45,
    //permissions: ["trip_execution", "vehicle_status", "trip_logs"],
    createdAt: "2024-01-01"
  },
  {
    id: 5,
    name: "HOD",
    description: "Head of Department with departmental oversight",
    userCount: 8,
    //permissions: ["trip_approval", "department_reports", "user_view", "budget_view"],
    createdAt: "2024-01-01"
  }
];

export default function Roles() {
  const [roles, setRoles] = useState<Roles[]>(initialRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Roles | null>(null);
   const [formData, setFormData] = useState<Partial<Roles>>({
      name: "",
      description:"",
      userCount:0 ,
      createdAt: new Date().toISOString().split("T")[0],
    });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Roles
  )=> {
    setFormData((prev) => ({...prev, [field]:e.target.value}));
  }

  const handleSubmit = () => {
    if(!formData.name || !formData.description){
      alert("name and description are required");
      return;
    }
    if(editingRole){
      setRoles((prev) => 
            prev.map((role) => 
              role.id === editingRole.id ? {...role, ...formData} : role
    )
  );}
  else{
    const newRole: Roles = {
      id: roles.length + 1,
      userCount:0,
      createdAt: new Date().toISOString().split("T")[0],
      description: formData.description,
      name: formData.name,
    } as Roles;
    setRoles((prev) => [...prev, newRole]);
  }
  setIsDialogOpen(false);
  setFormData({
    name:"",
    description:"",
    userCount:0,
    createdAt: new Date().toISOString().split("T")[0],
  });
  }

  const handleEditRole = (role: Roles) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description:role.description,
      userCount: role.userCount,
      createdAt: role.createdAt,
    });
    setIsDialogOpen(true);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      description:"",
      userCount:0,
      createdAt: new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(true);
  };

  const handleDeleteRole = (roleId: number) => {
    if(confirm("Are you sure you want to delete this role?")){
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className='p-3'>
          <h1 className='text-2xl'>ROLE MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">
            Manage user roles and their associated permissions
          </p>
        </div>
        <Button onClick={handleCreateRole} className='hover:bg-cyan-700'>
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            System roles and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Roles Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {role.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{role.userCount}</span>
                    </div>
                  </TableCell>
                
                  <TableCell className="text-sm text-muted-foreground">
                    {role.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRole(role.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Role
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

      {/* Create/Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {editingRole 
                ? 'Update role information and permissions'
                : 'Create a new role with specific permissions'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Name
              </Label>
              <Input
                id="roleName"
                value= {formData.name || ""}
                onChange={(e) => handleChange(e,"name")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange(e, "description")}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              {editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}