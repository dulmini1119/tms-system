"use client";
import React, { useState } from "react";
import {
  Bell,
  Send,
  MessageSquare,
  Users,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Target,
  Link,
  Archive,
} from "lucide-react";
import { mockSystemData } from "@/data/mock-system-data";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "Info" | "Success" | "Warning" | "Error" | "Alert";
  category:
    | "Trip"
    | "Vehicle"
    | "Driver"
    | "Document"
    | "System"
    | "Finance"
    | "Emergency"
    | "Maintenance";
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "Normal" | "High" | "Urgent";
  status: "Unread" | "Read" | "Acknowledged" | "Resolved" | "Dismissed";
  recipientType: "User" | "Role" | "Department" | "Broadcast";
  recipients: {
    userId?: string;
    userName?: string;
    roleId?: string;
    roleName?: string;
    departmentId?: string;
    departmentName?: string;
  }[];
  sender: {
    userId?: string;
    userName?: string;
    system: boolean;
  };
  relatedEntity?: {
    type: "Trip" | "Vehicle" | "Driver" | "Document" | "User";
    id: string;
    name: string;
  };
  actionable: boolean;
  actions?: {
    id: string;
    label: string;
    action: string;
    parameters?: Record<string, unknown>;
  }[];
  scheduledFor?: string;
  expiresAt?: string;
  tags: string[];
  readBy: {
    userId: string;
    userName: string;
    readAt: string;
  }[];
  acknowledgedBy?: {
    userId: string;
    userName: string;
    acknowledgedAt: string;
    comments?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [notifications, setNotifications] = useState(
    mockSystemData.notifications
  );

  // Mock current user ID (replace with actual auth context)
  const currentUserId = "current-user-id"; // TODO: Replace with actual user ID from auth

  // Filtered notifications
  const filteredNotifications = notifications.filter((notification) => {
    return (
      (notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.sender.userName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" ||
        notification.status.toLowerCase() === statusFilter) &&
      (typeFilter === "all" ||
        notification.type.toLowerCase() === typeFilter) &&
      (categoryFilter === "all" ||
        notification.category.toLowerCase() === categoryFilter)
    );
  });

  // Calculate stats
  const stats = {
    totalNotifications: notifications.length,
    unreadCount: notifications.filter((n) => n.status === "Unread").length,
    criticalCount: notifications.filter((n) => n.severity === "Critical")
      .length,
    emergencyCount: notifications.filter((n) => n.category === "Emergency")
      .length,
    acknowledgedCount: notifications.filter((n) => n.status === "Acknowledged")
      .length,
    actionableCount: notifications.filter((n) => n.actionable).length,
  };

  // Handlers
  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailsDialogOpen(true);
  };

  const handleComposeNotification = () => {
    setSelectedNotification(null); // Reset for new notification
    setIsComposeDialogOpen(true);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              status: "Read" as Notification["status"], // Explicitly type as status enum
              readBy: [
                ...notification.readBy,
                {
                  userId: currentUserId,
                  userName: "Current User",
                  readAt: new Date().toISOString(),
                },
              ],
            }
          : notification
      )
    );
  };

  const handleTakeAction = (notification: Notification) => {
    console.log(
      `Taking action on notification ${notification.id}`,
      notification.actions
    );
    // Implement action logic, e.g., open a dialog for action parameters
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsComposeDialogOpen(true);
  };

  const handleArchiveNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: "Archived" as Notification["status"] }
          : notification
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const getStatusBadge = (status: Notification["status"]) => {
    const variants: Record<
      Notification["status"],
      {
        variant: "default" | "secondary" | "outline" | "destructive";
        icon: React.ReactNode;
      }
    > = {
      Unread: { variant: "secondary", icon: <Bell className="h-3 w-3" /> },
      Read: { variant: "outline", icon: <Eye className="h-3 w-3" /> },
      Acknowledged: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      Resolved: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      Dismissed: { variant: "outline", icon: <XCircle className="h-3 w-3" /> },
    };
    const config = variants[status] || variants["Unread"];
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecipientSummary = (notification: Notification) => {
    if (notification.recipientType === "Broadcast") {
      return "All Users";
    }
    if (notification.recipients.length === 0) return "No recipients";
    if (notification.recipients.length === 1) {
      const recipient = notification.recipients[0];
      return (
        recipient.userName ||
        recipient.roleName ||
        recipient.departmentName ||
        "Unknown"
      );
    }
    return `${notification.recipients.length} recipients`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage system notifications and communications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleComposeNotification}>
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {stats.totalNotifications}
                </div>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.unreadCount}</div>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.emergencyCount}</div>
                <p className="text-sm text-muted-foreground">Emergency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Center */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            System-wide notifications and user communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6 flex-wrap gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="trip">Trip</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Responsive Table/Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="space-y-2">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sender:{" "}
                    {notification.sender.system
                      ? "System"
                      : notification.sender.userName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(notification.createdAt)}
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(notification.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(notification)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {notification.status === "Unread" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        {notification.actionable && (
                          <DropdownMenuItem
                            onClick={() => handleTakeAction(notification)}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Take Action
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleEditNotification(notification)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Notification
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleArchiveNotification(notification.id)
                          }
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%] min-w-[200px]">
                    Notification Details
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[150px]">
                    Recipients
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[150px]">
                    Sender & Timing
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[10%] min-w-[80px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="break-words max-w-[300px]">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {notification.message}
                      </div>
                      {notification.relatedEntity && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Link className="h-3 w-3 mr-1" />
                          {notification.relatedEntity.type}:{" "}
                          {notification.relatedEntity.name}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        ID: {notification.id}
                      </div>
                    </TableCell>
                    <TableCell className="break-words">
                      <div className="space-y-1">
                        <div className="text-sm flex items-center">
                          {notification.recipientType === "Broadcast" ? (
                            <Users className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {notification.recipientType}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getRecipientSummary(notification)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Read by: {notification.readBy.length}
                        </div>
                        {notification.acknowledgedBy && (
                          <div className="text-xs text-green-600">
                            Acknowledged by:{" "}
                            {notification.acknowledgedBy.userName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="break-words">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {notification.sender.system
                            ? "System"
                            : notification.sender.userName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {formatDate(notification.createdAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated: {formatDate(notification.updatedAt)}
                        </div>
                        {notification.scheduledFor && (
                          <div className="text-xs text-blue-600">
                            Scheduled: {formatDate(notification.scheduledFor)}
                          </div>
                        )}
                        {notification.expiresAt && (
                          <div className="text-xs text-orange-600">
                            Expires: {formatDate(notification.expiresAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(notification.status)}
                        {notification.actions &&
                          notification.actions.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {notification.actions.length} action(s)
                            </div>
                          )}
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
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(notification)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {notification.status === "Unread" && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          {notification.actionable && (
                            <DropdownMenuItem
                              onClick={() => handleTakeAction(notification)}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              Take Action
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleEditNotification(notification)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Notification
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleArchiveNotification(notification.id)
                            }
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

      {/* Notification Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background text-foreground shadow-xl p-6">
          {/* Header */}
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-semibold">
              Notification Details
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {selectedNotification && (
                <>
                  Complete information for notification:{" "}
                  <span className="font-medium">
                    {selectedNotification.title}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-6">
            {selectedNotification && (
              <>
                {/* Basic Information */}
                <section className="space-y-2">
                  <h4 className="font-semibold text-lg border-b border-border pb-1">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Title:</span>{" "}
                      {selectedNotification.title}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedNotification.type}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedNotification.category}
                    </div>
                    <div>
                      <span className="font-medium">Severity:</span>{" "}
                      {selectedNotification.severity}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>{" "}
                      {selectedNotification.priority}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedNotification.status}
                    </div>
                    <div>
                      <span className="font-medium">Actionable:</span>{" "}
                      {selectedNotification.actionable ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Recipient Type:</span>{" "}
                      {selectedNotification.recipientType}
                    </div>
                  </div>

                  <div className="text-sm mt-2">
                    <span className="font-medium">Message:</span>
                    <div className="mt-1 p-4 rounded-lg bg-muted text-muted-foreground break-words shadow-sm">
                      {selectedNotification.message}
                    </div>
                  </div>
                </section>

                {/* Recipients */}
                <section className="space-y-2">
                  <h4 className="font-semibold text-lg border-b border-border pb-1">
                    Recipients ({selectedNotification.recipients.length})
                  </h4>
                  {selectedNotification.recipients.length > 0 ? (
                    <div className="space-y-2">
                      {selectedNotification.recipients.map(
                        (recipient, index) => (
                          <div
                            key={index}
                            className="text-sm border border-border rounded-lg p-3 bg-muted text-foreground shadow-sm"
                          >
                            {recipient.userName && (
                              <div>
                                <span className="font-medium">User:</span>{" "}
                                {recipient.userName}
                              </div>
                            )}
                            {recipient.roleName && (
                              <div>
                                <span className="font-medium">Role:</span>{" "}
                                {recipient.roleName}
                              </div>
                            )}
                            {recipient.departmentName && (
                              <div>
                                <span className="font-medium">Department:</span>{" "}
                                {recipient.departmentName}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No specific recipients
                    </div>
                  )}
                </section>

                {/* Sender Information */}
                <section className="space-y-2">
                  <h4 className="font-semibold text-lg border-b border-border pb-1">
                    Sender Information
                  </h4>
                  <div className="text-sm text-foreground">
                    {selectedNotification.sender.system ? (
                      <div className="italic text-muted-foreground">
                        System Generated
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-medium">Sender:</span>{" "}
                          {selectedNotification.sender.userName}
                        </div>
                        <div>
                          <span className="font-medium">User ID:</span>{" "}
                          {selectedNotification.sender.userId}
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* Related Entity */}
                {selectedNotification.relatedEntity && (
                  <section className="space-y-2">
                    <h4 className="font-semibold text-lg border-b border-border pb-1">
                      Related Entity
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-foreground">
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        {selectedNotification.relatedEntity.type}
                      </div>
                      <div>
                        <span className="font-medium">ID:</span>{" "}
                        {selectedNotification.relatedEntity.id}
                      </div>
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedNotification.relatedEntity.name}
                      </div>
                    </div>
                  </section>
                )}

                {/* Actions */}
                {selectedNotification.actions?.length ? (
                  <section className="space-y-2">
                    <h4 className="font-semibold text-lg border-b border-border pb-1">
                      Available Actions
                    </h4>
                    <div className="space-y-2">
                      {selectedNotification.actions.map((action, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-3 bg-muted text-foreground shadow-sm text-sm"
                        >
                          <div className="font-medium">{action.label}</div>
                          <div className="text-muted-foreground">
                            Action: {action.action}
                          </div>
                          {action.parameters && (
                            <div className="text-muted-foreground">
                              Parameters: {JSON.stringify(action.parameters)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* Read By */}
                {selectedNotification.readBy?.length > 0 && (
                  <section className="space-y-2">
                    <h4 className="font-semibold text-lg border-b border-border pb-1">
                      Read By ({selectedNotification.readBy.length})
                    </h4>
                    <div className="space-y-1 text-sm">
                      {selectedNotification.readBy.map((readBy, index) => (
                        <div
                          key={index}
                          className="flex justify-between border-b border-border py-1"
                        >
                          <span>{readBy.userName}</span>
                          <span className="text-muted-foreground">
                            {formatDate(readBy.readAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Acknowledgment */}
                {selectedNotification.acknowledgedBy && (
                  <section className="space-y-2">
                    <h4 className="font-semibold text-lg border-b border-border pb-1">
                      Acknowledgment
                    </h4>
                    <div className="text-sm border border-border rounded-lg p-4 bg-muted shadow-sm">
                      <div>
                        <span className="font-medium">Acknowledged by:</span>{" "}
                        {selectedNotification.acknowledgedBy.userName}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(
                          selectedNotification.acknowledgedBy.acknowledgedAt
                        )}
                      </div>
                      {selectedNotification.acknowledgedBy.comments && (
                        <div>
                          <span className="font-medium">Comments:</span>{" "}
                          {selectedNotification.acknowledgedBy.comments}
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Tags */}
                {selectedNotification.tags?.length > 0 && (
                  <section className="space-y-2">
                    <h4 className="font-semibold text-lg border-b border-border pb-1">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotification.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-1 bg-muted text-foreground rounded-full"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Timing Information */}
                <section className="space-y-2">
                  <h4 className="font-semibold text-lg border-b border-border pb-1">
                    Timing Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-foreground">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDate(selectedNotification.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {formatDate(selectedNotification.updatedAt)}
                    </div>
                    {selectedNotification.scheduledFor && (
                      <div>
                        <span className="font-medium">Scheduled For:</span>{" "}
                        {formatDate(selectedNotification.scheduledFor)}
                      </div>
                    )}
                    {selectedNotification.expiresAt && (
                      <div>
                        <span className="font-medium">Expires At:</span>{" "}
                        {formatDate(selectedNotification.expiresAt)}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="mt-6 flex justify-end">
            <Button
              variant="default"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compose/Edit Notification Dialog */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="sm:max-w-[650px] w-full rounded-2xl border border-border bg-background text-foreground shadow-xl p-6 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-semibold">
              {selectedNotification
                ? "Edit Notification"
                : "Send New Notification"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {selectedNotification
                ? "Edit the existing notification details"
                : "Create and send a notification to users, roles, or departments"}
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-6">
            {/* Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue={selectedNotification?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Success">Success</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Error">Error</SelectItem>
                    <SelectItem value="Alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue={selectedNotification?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trip">Trip</SelectItem>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Notification title"
                defaultValue={selectedNotification?.title}
                className="bg-muted text-foreground border-border"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Notification message content..."
                rows={4}
                defaultValue={selectedNotification?.message}
                className="bg-muted text-foreground border-border"
              />
            </div>

            {/* Priority & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue={selectedNotification?.priority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select defaultValue={selectedNotification?.severity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="space-y-2">
                <Select defaultValue={selectedNotification?.recipientType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">Specific User</SelectItem>
                    <SelectItem value="Role">Role</SelectItem>
                    <SelectItem value="Department">Department</SelectItem>
                    <SelectItem value="Broadcast">All Users</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter recipient details"
                  defaultValue={
                    selectedNotification
                      ? getRecipientSummary(selectedNotification)
                      : ""
                  }
                  className="bg-muted text-foreground border-border"
                />
              </div>
            </div>

            {/* Actionable */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="actionable"
                defaultChecked={selectedNotification?.actionable}
              />
              <Label htmlFor="actionable">
                This notification requires action
              </Label>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <Label>Schedule (Optional)</Label>
              <Input
                type="datetime-local"
                defaultValue={
                  selectedNotification?.scheduledFor
                    ? new Date(selectedNotification.scheduledFor)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="bg-muted text-foreground border-border"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsComposeDialogOpen(false);
                setSelectedNotification(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement save logic (create/update notification)
                setIsComposeDialogOpen(false);
                setSelectedNotification(null);
              }}
            >
              {selectedNotification
                ? "Update Notification"
                : "Send Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
