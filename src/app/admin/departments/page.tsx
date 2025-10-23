"use client";
import React, { useState } from "react";

import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Briefcase,
  Building,
} from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Departments {
  id: number;
  name: string;
  code: string;
  hod: string;
  hodEmail: string;
  employeeCount: number;
  businessUnit: string;
  budget: number;
  createdAt: string;
}

const initialDepartments: Departments[] = [
  {
    id: 1,
    name: "Information Technology",
    code: "IT",
    hod: "John Smith",
    hodEmail: "john.smith@company.com",
    employeeCount: 45,
    businessUnit: "Technology",
    budget: 2500000,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Marketing",
    code: "MKT",
    hod: "Sarah Johnson",
    hodEmail: "sarah.johnson@company.com",
    employeeCount: 32,
    businessUnit: "Sales & Marketing",
    budget: 1800000,
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    name: "Human Resources",
    code: "HR",
    hod: "Mike Wilson",
    hodEmail: "mike.wilson@company.com",
    employeeCount: 18,
    businessUnit: "Administration",
    budget: 950000,
    createdAt: "2024-01-01",
  },
  {
    id: 4,
    name: "Finance",
    code: "FIN",
    hod: "Emily Davis",
    hodEmail: "emily.davis@company.com",
    employeeCount: 25,
    businessUnit: "Finance",
    budget: 1200000,
    createdAt: "2024-01-01",
  },
  {
    id: 5,
    name: "Operations",
    code: "OPS",
    hod: "David Brown",
    hodEmail: "david.brown@company.com",
    employeeCount: 67,
    businessUnit: "Operations",
    budget: 3200000,
    createdAt: "2024-01-01",
  },
];

const availableHODs = [
  "John Smith",
  "Sarah Johnson",
  "Mike Wilson",
  "Emily Davis",
  "David Brown",
  "Lisa Anderson",
  "Tom Garcia",
];

const businessUnits = [
  "Technology",
  "Sales & Marketing",
  "Administration",
  "Finance",
  "Operations",
];

export default function Departments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Departments | null>(null);
  const [departments, setDepartments] = useState<Departments[]>(initialDepartments);
  const [formData,setFormData] = useState<Partial<Departments>>({
    name: "",
    code: "",
    hod:"",
    hodEmail: "",
    businessUnit: "",
    budget:0,
    employeeCount:0,
    createdAt: new Date().toISOString().split("T")[0],
  })

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDepartment = (department: Departments) => {
    setEditingDepartment(department);
    setFormData(department);
    setIsDialogOpen(true);
  };

  const handleCreateDepartment = () => {
    setEditingDepartment(null);
    setIsDialogOpen(true);
  };

const formatCurrency = (amount: number) => {
  return `Rs. ${new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

const handleChange = (
  field: keyof Departments,
  value: string | number
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
    hodEmail: field === "hod" && typeof value === 'string' ? `${value.toLowerCase().replace(" ",".")}@company.com`: prev.hodEmail,
  }))
}

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.hod || !formData.businessUnit) {
      alert("Please fill in all required fields.");
      return;
    }
    if(editingDepartment) {
      setDepartments((prev) =>
        prev.map((dept) => 
          dept.id === editingDepartment.id ? {...dept, ...formData, id: dept.id} : dept
        )
      );
    } else {
      setDepartments((prev) => [
        ...prev,
        {
          ...formData,
          id: prev.length+ 1,
          employeeCount:0,
          createdAt: formData.createdAt || new Date().toISOString().split("T")[0],
        }as Departments
      ])
    }
    setIsDialogOpen(false);
    setFormData({
      id:0,
      name:"",
      code:"",
      hod:"",
      hodEmail:"",
      businessUnit:"",
      budget:0,
      employeeCount:0,
      createdAt: new Date().toISOString().split("T")[0],
    })
  }

  const handleDelete = (id: number) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id))
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="p-3">
          <h1 className="text-2xl">DEPARTMENT MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">
            Manage organizational departments and their hierarchy
          </p>
        </div>
        <Button onClick={handleCreateDepartment} className="hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>
            List of all departments in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Departments Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Head of Department</TableHead>
                <TableHead>Business Unit</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Budget</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{department.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {department.code}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{department.hod}</div>
                      <div className="text-sm text-muted-foreground">
                        {department.hodEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1 w-fit"
                    >
                      <Building className="h-3 w-3" />
                      <span>{department.businessUnit}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{department.employeeCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(department.budget)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditDepartment(department)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"
                          onClick={() => handleDelete(department.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Department
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

      {/* Create/Edit Department Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Department" : "Create New Department"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? "Update department information and settings"
                : "Add a new department to the organization"}
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
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) => handleChange("code", e.target.value)}
                className="col-span-3"
                placeholder="e.g., IT, HR, FIN"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hod" className="text-right">
                Head of Dept.
              </Label>
              <Select value={formData.hod || ""} onValueChange={(value) => handleChange("hod",value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select HOD" />
                </SelectTrigger>
                <SelectContent>
                  {availableHODs.map((hod) => (
                    <SelectItem key={hod} value={hod}>
                      {hod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessUnit" className="text-right">
                Business Unit
              </Label>
              <Select value={formData.businessUnit || ""} onValueChange={(value) => handleChange("businessUnit",value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select business unit" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget (Rs.)
              </Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                className="col-span-3"
                placeholder="Annual budget"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              {editingDepartment ? "Update Department" : "Create Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

