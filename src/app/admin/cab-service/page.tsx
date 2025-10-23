"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Car,
  Phone,
  Mail,
  FileText,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CabService {
  id: number;
  name: string;
  businessRegNo: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  vehicleCount: number;
  status: "Active" | "Inactive";
  joinedDate: string;
}

const initialCabServices: CabService[] = [
  {
    id: 1,
    name: "City Cabs Ltd",
    businessRegNo: "BR-4999MH2018PTC123456",
    contactPerson: "Rajesh Kumar",
    phone: "+94 765243210",
    email: "rajesh@citycabs.com",
    address: "123 Main Street, Andheri, Mumbai - 400058",
    vehicleCount: 45,
    status: "Active",
    joinedDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Swift Transport Co",
    businessRegNo: "BR-U74999DL2019PTC789012",
    contactPerson: "Priya Sharma",
    phone: "+94 765043211",
    email: "priya@swifttransport.com",
    address: "456 Business Park, Gurgaon, Delhi - 122001",
    vehicleCount: 78,
    status: "Active",
    joinedDate: "2023-03-20",
  },
  {
    id: 3,
    name: "Metro Cab Services",
    businessRegNo: "BR-U74999KA2020PTC345678",
    contactPerson: "Amit Patel",
    phone: "+94 765043212",
    email: "amit@metrocabs.com",
    address: "789 Tech Park, Whitefield, Bangalore - 560066",
    vehicleCount: 32,
    status: "Inactive",
    joinedDate: "2023-06-10",
  },
  {
    id: 4,
    name: "Express Wheels",
    businessRegNo: "BR-U74999TN2021PTC901234",
    contactPerson: "Lakshmi Iyer",
    phone: "+94 765943213",
    email: "lakshmi@expresswheels.com",
    address: "321 IT Corridor, OMR, Chennai - 600096",
    vehicleCount: 56,
    status: "Active",
    joinedDate: "2023-08-05",
  },
];

export default function CabServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CabService | null>(null);
  const [cabServices, setCabServices] = useState<CabService[]>(initialCabServices);
  const [formData, setFormData] = useState<Partial<CabService>>({
    name: "",
    businessRegNo: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    status: "Active",
    joinedDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchVehicleCounts = async () => {
      // Mock API response for vehicleCount
      const mockResponse = [
        { id: 1, vehicleCount: 45 },
        { id: 2, vehicleCount: 78 },
        { id: 3, vehicleCount: 32 },
        { id: 4, vehicleCount: 56 },
      ];

      setCabServices((prev) =>
        prev.map((service) => {
          const count = mockResponse.find((r) => r.id === service.id)?.vehicleCount || service.vehicleCount;
          return { ...service, vehicleCount: count };
        })
      );
    };
    fetchVehicleCounts();
  }, []);

  const filteredServices = cabServices.filter(
    (service) =>
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.businessRegNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all-status" || service.status === statusFilter)
  );

  const handleEditService = (service: CabService) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleCreateService = () => {
    setEditingService(null);
    setFormData({
      name: "",
      businessRegNo: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleChange = (
    field: keyof CabService,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.businessRegNo ||
      !formData.contactPerson ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.status ||
      !formData.joinedDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!/^\+94 \d{9}$/.test(formData.phone || "")) {
      alert("Phone number must be in the format +94 987654321");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "")) {
      alert("Please provide a valid email address.");
      return;
    }
    if (isNaN(new Date(formData.joinedDate).getTime())) {
      alert("Please provide a valid join date.");
      return;
    }
    if (
      cabServices.some(
        (service) =>
          service.businessRegNo === formData.businessRegNo &&
          (!editingService || service.id !== editingService.id)
      )
    ) {
      alert("Business Registration Number must be unique.");
      return;
    }

    if (editingService) {
      setCabServices((prev) =>
        prev.map((service) =>
          service.id === editingService.id
            ? { ...service, ...formData, id: service.id, vehicleCount: service.vehicleCount }
            : service
        )
      );
    } else {
      setCabServices((prev) => [
        ...prev,
        {
          ...formData,
          id: prev.length + 1,
          vehicleCount: 0, 
        } as CabService,
      ]);
    }
    setIsDialogOpen(false);
    setFormData({
      name: "",
      businessRegNo: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = (id: number) => {
    setCabServices((prev) => prev.filter((service) => service.id !== id));
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "Active" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center">
        <div className="p-3">
          <h1 className="text-2xl">CAB SERVICE</h1>
          <p className="text-muted-foreground text-xs">
            Manage cab service providers and their details
          </p>
        </div>
        <Button onClick={handleCreateService} className="hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          Add Cab Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Providers</CardTitle>
          <CardDescription>
            List of registered cab service providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
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

         <div className="overflow-x-auto">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Provider</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Business Registration</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {service.joinedDate}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{service.contactPerson}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {service.phone}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {service.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-mono">{service.businessRegNo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{service.vehicleCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert(`Viewing agreements for ${service.name}`)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Agreements
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(service.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Service
                        </DropdownMenuItem>
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
        <DialogContent className="sm:w-[80vw] md:w-[60vw] lg:w-[625px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Cab Service" : "Add New Cab Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update cab service provider information"
                : "Register a new cab service provider"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Company Name
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessRegNo" className="text-right">
                Business Reg No.
              </Label>
              <Input
                id="businessRegNo"
                value={formData.businessRegNo || ""}
                onChange={(e) => handleChange("businessRegNo", e.target.value)}
                className="col-span-3"
                placeholder="BR-XXXXXXXXXXXXXXXXX"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => handleChange("contactPerson", e.target.value)}
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
                onChange={(e) => handleChange("phone", e.target.value)}
                className="col-span-3"
                placeholder="+91 9876543210"
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
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="address" className="text-right mt-2">
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status || ""}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinedDate" className="text-right">
                Joined Date
              </Label>
              <Input
                id="joinedDate"
                type="date"
                value={formData.joinedDate || ""}
                onChange={(e) => handleChange("joinedDate", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {editingService ? "Update Service" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}