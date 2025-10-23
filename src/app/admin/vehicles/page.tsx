"use client"
import React, { useState } from 'react';

import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Car,
  Fuel,
  Calendar,
  MapPin,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Vehicles {
  id: number,
  registrationNo: string,
  make: string,
  model:string,
  year: number,
  type: string,
  source: string,
  fuelType : string,
  seatingCapacity: number,
  status: string,
  currentDriver:string,
  lastService: string,
  nextService: string,
  mileage: number,
  insuranceExpiry : string,
  location: string
}

const vehicles = [
  {
    id: 1,
    registrationNo: "MH-12-AB-1234",
    make: "Honda",
    model: "City",
    year: 2022,
    type: "Sedan",
    source: "Owned",
    fuelType: "Petrol",
    seatingCapacity: 5,
    status: "Available",
    currentDriver: "Rajesh Kumar",
    lastService: "2024-01-10",
    nextService: "2024-04-10",
    mileage: 45000,
    insuranceExpiry: "2024-12-15",
    location: "Mumbai - Andheri"
  },
  {
    id: 2,
    registrationNo: "DL-03-CD-5678",
    make: "Maruti",
    model: "Swift Dzire",
    year: 2021,
    type: "Sedan",
    source: "Leased",
    fuelType: "CNG",
    seatingCapacity: 5,
    status: "On Trip",
    currentDriver: "Amit Sharma",
    lastService: "2024-01-05",
    nextService: "2024-04-05",
    mileage: 62000,
    insuranceExpiry: "2024-11-30",
    location: "Delhi - Gurgaon"
  },
  {
    id: 3,
    registrationNo: "KA-05-EF-9012",
    make: "Toyota",
    model: "Innova Crysta",
    year: 2023,
    type: "SUV",
    source: "Owned",
    fuelType: "Diesel",
    seatingCapacity: 8,
    status: "Under Repair",
    currentDriver: "Priya Iyer",
    lastService: "2023-12-20",
    nextService: "2024-03-20",
    mileage: 28000,
    insuranceExpiry: "2025-01-20",
    location: "Bangalore - Whitefield"
  },
  {
    id: 4,
    registrationNo: "TN-09-GH-3456",
    make: "Tata",
    model: "Nexon",
    year: 2022,
    type: "SUV",
    source: "Leased",
    fuelType: "Electric",
    seatingCapacity: 5,
    status: "Available",
    currentDriver: "Lakshmi Reddy",
    lastService: "2024-01-15",
    nextService: "2024-04-15",
    mileage: 35000,
    insuranceExpiry: "2024-10-25",
    location: "Chennai - OMR"
  },
  {
    id: 5,
    registrationNo: "MH-14-IJ-7890",
    make: "Mahindra",
    model: "Scorpio",
    year: 2020,
    type: "SUV",
    source: "Owned",
    fuelType: "Diesel",
    seatingCapacity: 7,
    status: "Available",
    currentDriver: "Suresh Patil",
    lastService: "2024-01-08",
    nextService: "2024-04-08",
    mileage: 78000,
    insuranceExpiry: "2024-09-10",
    location: "Pune - Hinjewadi"
  }
];

const vehicleTypes = ["Sedan", "SUV", "Hatchback", "Van", "Truck"];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const sourceTypes = ["Owned", "Leased", "Rented"];
const statusTypes = ["Available", "On Trip", "Under Repair", "Maintenance"];

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all-types');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [sourceFilter, setSourceFilter] = useState('all-sources');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicles | null>(null);
  const [formData, setFormData] = useState({
    registrationNo: '',
    make: '',
    model: '',
    year: '',
    type: '',
    source: '',
    fuelType: '',
    seatingCapacity: '',
    status: '',
    currentDriver: '',
    lastService: '',
    nextService: '',
    mileage: '',
    insuranceExpiry: '',
    location: ''
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    return (
      vehicle.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.currentDriver.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (typeFilter === 'all-types' || vehicle.type === typeFilter) &&
    (statusFilter === 'all-status' || vehicle.status === statusFilter) &&
    (sourceFilter === 'all-sources' || vehicle.source === sourceFilter);
  });

  const handleEditVehicle = (vehicle: Vehicles) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleCreateVehicle = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'Available' ? 'default' : 
                   status === 'On Trip' ? 'secondary' : 
                   status === 'Under Repair' ? 'destructive' : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getSourceBadge = (source: string) => {
    const variant = source === 'Owned' ? 'default' : 'outline';
    return <Badge variant={variant}>{source}</Badge>;
  };

  const isServiceDue = (nextServiceDate: string) => {
    const service = new Date(nextServiceDate);
    const today = new Date();
    const diffTime = service.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className='p-3'>
          <h1 className='text-2xl'>Vehicle Management</h1>
          <p className="text-muted-foreground text-xs">
            Manage your fleet vehicles and their status
          </p>
        </div>
        <Button onClick={handleCreateVehicle}>
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
          <CardDescription>
            Complete list of vehicles in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                {vehicleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                {statusTypes.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-sources">All Sources</SelectItem>
                {sourceTypes.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicles Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Details</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{vehicle.registrationNo}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {vehicle.type}
                          </Badge>
                          {getSourceBadge(vehicle.source)}
                          <Badge variant="secondary" className="text-xs flex items-center">
                            <Fuel className="h-3 w-3 mr-1" />
                            {vehicle.fuelType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.currentDriver}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.seatingCapacity} seater
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(vehicle.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Next: {vehicle.nextService}
                      </div>
                      {isServiceDue(vehicle.nextService) && (
                        <div className="flex items-center text-yellow-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Service Due</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{vehicle.mileage.toLocaleString()} km</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      {vehicle.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Maintenance Log
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Service
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Vehicle
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

      {/* Create/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle 
                ? 'Update vehicle information and details'
                : 'Register a new vehicle in the fleet'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registrationNo" className="text-right">
                Registration No.
              </Label>
              <Input
                id="registrationNo"
                defaultValue={editingVehicle?.registrationNo || ''}
                className="col-span-3"
                placeholder="MH-12-AB-1234"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="make" className="text-right col-span-2">
                  Make
                </Label>
                <Input
                  id="make"
                  defaultValue={editingVehicle?.make || ''}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right col-span-2">
                  Model
                </Label>
                <Input
                  id="model"
                  defaultValue={editingVehicle?.model || ''}
                  className="col-span-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right col-span-2">
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  defaultValue={editingVehicle?.year || ''}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right col-span-2">
                  Type
                </Label>
                <Select defaultValue={editingVehicle?.type || ''}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fuelType" className="text-right col-span-2">
                  Fuel Type
                </Label>
                <Select defaultValue={editingVehicle?.fuelType || ''}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select fuel" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right col-span-2">
                  Source
                </Label>
                <Select defaultValue={editingVehicle?.source || ''}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceTypes.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}