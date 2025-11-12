import React from "react";

import {
  User,
  Car,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock driver profile data
const mockDriverProfile = {
  personalInfo: {
    name: "Mike Johnson",
    employeeId: "DRV001",
    phone: "+91 9876543210",
    email: "mike.johnson@company.com",
    address: "123 Driver Street, Bangalore, Karnataka 560001",
    dateOfJoining: "2022-03-15",
    licenseNumber: "KA0220220001234",
    licenseExpiry: "2025-03-14",
  },
  currentVehicle: {
    make: "Honda",
    model: "City",
    year: "2022",
    licensePlate: "KA01AB1234",
    fuelType: "Petrol",
    seatingCapacity: 5,
    assignedDate: "2024-01-01",
  },
  documents: [
    {
      id: "DOC001",
      type: "Driving License",
      number: "KA0220220001234",
      issueDate: "2020-03-15",
      expiryDate: "2025-03-14",
      status: "valid",
    },
    {
      id: "DOC002",
      type: "Medical Certificate",
      number: "MED2024001",
      issueDate: "2024-01-01",
      expiryDate: "2025-01-01",
      status: "valid",
    },
    {
      id: "DOC003",
      type: "Background Verification",
      number: "BG2022001",
      issueDate: "2022-03-01",
      expiryDate: "2025-03-01",
      status: "valid",
    },
    {
      id: "DOC004",
      type: "Training Certificate",
      number: "TRN2024001",
      issueDate: "2024-01-15",
      expiryDate: "2025-01-15",
      status: "valid",
    },
  ],
  performance: {
    totalTrips: 245,
    averageRating: 4.7,
    onTimePercentage: 92,
    fuelEfficiency: 15.2, // km/l
    incidents: 0,
    compliments: 23,
  },
};

export default function DriverProfile() {
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "default";
      case "expiring":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4" />;
      case "expiring":
        return <AlertTriangle className="h-4 w-4" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isDocumentExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const getDocumentStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 30) return "expiring";
    return "valid";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Driver Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and documents
          </p>
        </div>
        {/* Profile is read-only for drivers */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p>{mockDriverProfile.personalInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Employee ID
                </label>
                <p>{mockDriverProfile.personalInfo.employeeId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {mockDriverProfile.personalInfo.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {mockDriverProfile.personalInfo.email}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Address
              </label>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                {mockDriverProfile.personalInfo.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Joining
                </label>
                <p>{mockDriverProfile.personalInfo.dateOfJoining}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  License Number
                </label>
                <p>{mockDriverProfile.personalInfo.licenseNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Total Trips
              </label>
              <p className="text-2xl font-bold">
                {mockDriverProfile.performance.totalTrips}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Average Rating
              </label>
              <p className="text-2xl font-bold">
                {mockDriverProfile.performance.averageRating}/5
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                On-Time %
              </label>
              <p className="text-2xl font-bold">
                {mockDriverProfile.performance.onTimePercentage}%
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Fuel Efficiency
              </label>
              <p className="text-2xl font-bold">
                {mockDriverProfile.performance.fuelEfficiency} km/l
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Incidents
              </label>
              <p className="text-2xl font-bold text-green-600">
                {mockDriverProfile.performance.incidents}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Vehicle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Current Vehicle Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Vehicle
              </label>
              <p className="font-medium">
                {mockDriverProfile.currentVehicle.make}{" "}
                {mockDriverProfile.currentVehicle.model} (
                {mockDriverProfile.currentVehicle.year})
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                License Plate
              </label>
              <p className="font-medium">
                {mockDriverProfile.currentVehicle.licensePlate}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Fuel Type
              </label>
              <p>{mockDriverProfile.currentVehicle.fuelType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Assigned Date
              </label>
              <p>{mockDriverProfile.currentVehicle.assignedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents & Certifications
          </CardTitle>
          <CardDescription>
            Keep your documents up to date to ensure compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Document Number</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDriverProfile.documents.map((doc) => {
                const status = getDocumentStatus(doc.expiryDate);
                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.type}</TableCell>
                    <TableCell>{doc.number}</TableCell>
                    <TableCell>{doc.issueDate}</TableCell>
                    <TableCell>
                      <div
                        className={
                          isDocumentExpiringSoon(doc.expiryDate)
                            ? "text-orange-600"
                            : ""
                        }
                      >
                        {doc.expiryDate}
                        {isDocumentExpiringSoon(doc.expiryDate) && (
                          <p className="text-xs text-orange-600">
                            Expires soon!
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getDocumentStatusColor(status)}
                        className="gap-1"
                      >
                        {getDocumentStatusIcon(status)}
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
