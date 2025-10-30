"use client";
import React, { useEffect, useState } from "react";

import {
  Users,
  Car,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Navigation,
  MapPin,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";
import { TripAssignment, TripRequest } from "@/types/trip-interfaces";
import { mockTripData } from "@/data/mock-trip-data";
import { Badge, badgeVariants } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { VariantProps } from "class-variance-authority";

export default function TripAssignments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<TripAssignment | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // --- Edit Assignment Form State ---
const [editVehicleId, setEditVehicleId] = useState<string>("");
const [editDriverId, setEditDriverId] = useState<string>("");
const [editNotes, setEditNotes] = useState<string>("");



  // Get trip assignments and related requests
const [tripAssignments, setTripAssignments] = useState(mockTripData.assignments);
  const tripRequests = mockTripData.requests;



  // Create a map for quick request lookup
  const requestMap = new Map(tripRequests.map((req) => [req.id, req]));

  const filteredAssignments = tripAssignments.filter((assignment) => {
    const request = requestMap.get(assignment.tripRequestId);
    if (!request) return false;

    return (
      (assignment.requestNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        assignment.assignedDriver.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.assignedVehicle.vehicleNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.requestedBy.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" ||
        assignment.assignmentStatus.toLowerCase().replace(" ", "-") ===
          statusFilter)
    );
  });

  // Calculate stats
  const stats = {
    assigned: tripAssignments.filter((a) => a.assignmentStatus === "Assigned")
      .length,
    accepted: tripAssignments.filter((a) => a.assignmentStatus === "Accepted")
      .length,
    started: tripAssignments.filter((a) => a.assignmentStatus === "Started")
      .length,
    completed: tripAssignments.filter((a) => a.assignmentStatus === "Completed")
      .length,
  };

  const handleViewDetails = (assignment: TripAssignment) => {
    const request = requestMap.get(assignment.tripRequestId);
    if (!request) return;

    setSelectedAssignment(assignment);
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handleEditAssignment = (assignment: TripAssignment) => {
    const request = requestMap.get(assignment.tripRequestId);
    if (!request) return;

    setSelectedAssignment(assignment);
    setSelectedRequest(request);
    setIsAssignDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: VariantProps<typeof badgeVariants>["variant"];
        icon: React.ReactNode;
      }
    > = {
      Assigned: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      Accepted: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      Rejected: {
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
      },
      Started: { variant: "default", icon: <Navigation className="h-3 w-3" /> },
      Completed: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      Cancelled: { variant: "outline", icon: <XCircle className="h-3 w-3" /> },
    };
    const config = variants[status] || variants["Assigned"];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  // Pagination
  const totalPages =
    pageSize > 0 ? Math.ceil(filteredAssignments.length / pageSize) : 1;
  const paginatedDocuments = filteredAssignments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3">
        <div>
          <h1 className="text-2xl">TRIP ASSIGNMENTS</h1>
          <p className="text-muted-foreground text-xs">
            Assign vehicles and drivers to approved trips
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Auto Assign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.assigned}</div>
                <p className="text-sm text-muted-foreground">Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.accepted}</div>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.started}</div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Assignments</CardTitle>
          <CardDescription>
            Vehicle and driver assignments for approved trips
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="started">Started</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignments Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip Details</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pre-Trip</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((assignment) => {
                const request = requestMap.get(assignment.tripRequestId);
                if (!request) return null;

                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {assignment.requestNumber}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {request.purpose.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {request.requestedBy.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.requestedBy.department}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center">
                          <Car className="h-3 w-3 mr-1" />
                          {assignment.assignedVehicle.vehicleNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.assignedVehicle.make}{" "}
                          {assignment.assignedVehicle.model}
                        </div>
                        <div className="font-medium flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {assignment.assignedDriver.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          License: {assignment.assignedDriver.licenseNumber}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Scheduled: {formatDate(assignment.scheduledDeparture)}
                        </div>
                        {assignment.scheduledReturn && (
                          <div className="text-sm text-muted-foreground">
                            Return: {formatDate(assignment.scheduledReturn)}
                          </div>
                        )}
                        {assignment.actualDeparture && (
                          <div className="text-sm text-green-600">
                            Started: {formatDate(assignment.actualDeparture)}
                          </div>
                        )}
                        {assignment.actualReturn && (
                          <div className="text-sm text-green-600">
                            Completed: {formatDate(assignment.actualReturn)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(assignment.assignmentStatus)}
                      {assignment.driverAcceptance.accepted && (
                        <div className="text-xs text-green-600 mt-1">
                          Driver Accepted
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.preTrip.completedAt ? (
                        <div className="space-y-1">
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
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
                            onClick={() => handleViewDetails(assignment)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditAssignment(assignment)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Assignment
                          </DropdownMenuItem>
                          {assignment.assignmentStatus === "Assigned" && (
                            <>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Assignment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Assignment
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Pre-Trip Checklist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((s) => (
                    <SelectItem key={s} value={s.toString()}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">
                of {filteredAssignments.length} documents
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let num;
                  if (totalPages <= 5) num = i + 1;
                  else if (currentPage <= 3) num = i + 1;
                  else if (currentPage >= totalPages - 2)
                    num = totalPages - 4 + i;
                  else num = currentPage - 2 + i;
                  return num;
                }).map((num) => (
                  <Button
                    key={num}
                    variant={currentPage === num ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(num)}
                    className="w-9 h-9"
                  >
                    {num}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="w-[92vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl backdrop-blur-md transition-colors duration-300">
          {/* Header */}
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-foreground">
              Assignment Details
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {selectedRequest && selectedAssignment && (
                <>
                  Assignment for{" "}
                  <span className="font-medium text-primary">
                    {selectedAssignment.requestNumber}
                  </span>{" "}
                  — {selectedRequest.requestedBy.name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="space-y-8 py-6">
            {selectedAssignment && selectedRequest && (
              <>
                {/* Trip Information */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-primary">
                    <MapPin className="w-5 h-5 text-primary" /> Trip Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">
                        Purpose:
                      </span>{" "}
                      {selectedRequest.purpose.description}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Priority:
                      </span>{" "}
                      {selectedRequest.priority}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Departure:
                      </span>{" "}
                      {selectedRequest.tripDetails.departureDate} at{" "}
                      {selectedRequest.tripDetails.departureTime}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Passengers:
                      </span>{" "}
                      {selectedRequest.requirements.passengerCount}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium text-foreground">Route:</span>{" "}
                    {selectedRequest.tripDetails.fromLocation.address} →{" "}
                    {selectedRequest.tripDetails.toLocation.address}
                  </div>
                </section>

                {/* Vehicle Details */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-primary">
                    <Car className="w-5 h-5 text-primary" /> Assigned Vehicle
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">
                        Vehicle:
                      </span>{" "}
                      {selectedAssignment.assignedVehicle.vehicleNumber}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Model:
                      </span>{" "}
                      {selectedAssignment.assignedVehicle.make}{" "}
                      {selectedAssignment.assignedVehicle.model}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Type:</span>{" "}
                      {selectedAssignment.assignedVehicle.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">Fuel:</span>{" "}
                      {selectedAssignment.assignedVehicle.fuelType}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        Mileage:
                      </span>{" "}
                      {selectedAssignment.assignedVehicle.currentMileage} km
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        Last Service:
                      </span>{" "}
                      {selectedAssignment.assignedVehicle.lastServiceDate}
                    </div>
                  </div>
                </section>

                {/* Driver Details */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-primary">
                    <User className="w-5 h-5 text-primary" /> Assigned Driver
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">Name:</span>{" "}
                      {selectedAssignment.assignedDriver.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        Phone:
                      </span>{" "}
                      {selectedAssignment.assignedDriver.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        License:
                      </span>{" "}
                      {selectedAssignment.assignedDriver.licenseNumber}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        License Expiry:
                      </span>{" "}
                      {selectedAssignment.assignedDriver.licenseExpiryDate}
                    </div>
                  </div>
                </section>

                {/* Pre-Trip Checklist */}
                {selectedAssignment.preTrip.completedAt && (
                  <section className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-primary">
                      <ClipboardCheck className="w-5 h-5 text-primary" />{" "}
                      Pre-Trip Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">
                          Fuel Level:
                        </span>{" "}
                        {selectedAssignment.preTrip.checklist.fuelLevel}%
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Vehicle Condition:
                        </span>{" "}
                        {selectedAssignment.preTrip.checklist.vehicleCondition}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">
                          Documents :
                        </span>
                        {selectedAssignment.preTrip.checklist
                          .documentsVerified ? (
                          <span className="flex items-center gap-1 text-green-500 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            ✗ Not Verified
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="font-medium text-foreground">
                          Emergency Kit:
                        </span>{" "}
                        {selectedAssignment.preTrip.checklist
                          .emergencyKitPresent ? (
                          <span className="text-green-500 font-medium">
                            ✓ Present
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            ✗ Missing
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          GPS:
                        </span>{" "}
                        {selectedAssignment.preTrip.checklist.gpsWorking ? (
                          <span className="text-green-500 font-medium">
                            ✓ Working
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            ✗ Not Working
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Completed By:
                        </span>{" "}
                        {selectedAssignment.preTrip.completedBy}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium text-foreground">
                        Completed At:
                      </span>{" "}
                      {formatDate(selectedAssignment.preTrip.completedAt)}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="mt-4 border-t border-border pt-4">
            <Button
              onClick={() => setIsDetailsDialogOpen(false)}
              variant="secondary"
              className="px-6 py-2 text-sm font-medium rounded-lg hover:bg-muted transition"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Modify vehicle and driver assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select defaultValue={selectedAssignment?.assignedVehicle.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={selectedAssignment?.assignedVehicle.id || ""}
                    >
                      {selectedAssignment?.assignedVehicle.vehicleNumber} -{" "}
                      {selectedAssignment?.assignedVehicle.make}{" "}
                      {selectedAssignment?.assignedVehicle.model}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select defaultValue={selectedAssignment?.assignedDriver.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={selectedAssignment?.assignedDriver.id || ""}
                    >
                      {selectedAssignment?.assignedDriver.name} -{" "}
                      {selectedAssignment?.assignedDriver.phoneNumber}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assignment Notes</Label>
              <Textarea
                placeholder="Add any special instructions or notes..."
                defaultValue={selectedAssignment?.assignmentNotes}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAssignDialogOpen(false)}>
              Update Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
