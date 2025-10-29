'use client'
import React, { useState } from 'react';

import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  MoreHorizontal,
  Eye,
  User,
  Building2,
  Calendar,
  MapPin,
  AlertCircle,
  Users as UsersIcon,
  History
} from 'lucide-react';
import { mockTripData } from '@/data/mock-trip-data';
import { TripApproval, TripRequest } from '@/types/trip-interfaces';
import { VariantProps } from 'class-variance-authority';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function TripApprovals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<TripApproval | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  

  // Get trip approvals and related requests
  const tripApprovals = mockTripData.approvals;
  const tripRequests = mockTripData.requests;

  // Create a map for quick request lookup
  const requestMap = new Map(tripRequests.map(req => [req.id, req]));

  const filteredApprovals = tripApprovals.filter(approval => {
    const request = requestMap.get(approval.tripRequestId);
    if (!request) return false;

    return (
      approval.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (statusFilter === 'all' || approval.finalStatus.toLowerCase() === statusFilter);
  });


  const formatCost = (amount: number, currency: string): string => {
  const symbol = currency === "LKR" ? "Rs." : currency;
  return `${symbol} ${amount.toLocaleString()}`;
};

  // Calculate stats
  const stats = {
    pending: tripApprovals.filter(a => a.finalStatus === 'Pending').length,
    approved: tripApprovals.filter(a => a.finalStatus === 'Approved').length,
    rejected: tripApprovals.filter(a => a.finalStatus === 'Rejected').length,
    escalated: tripApprovals.filter(a => a.escalated).length
  };

  const handleApprovalAction = (approval: TripApproval, action: 'approve' | 'reject') => {
    const request = requestMap.get(approval.tripRequestId);
    if (!request) return;

    setSelectedApproval(approval);
    setSelectedRequest(request);
    setApprovalAction(action);
    setComments('');
    setIsApprovalDialogOpen(true);
  };

  const handleViewHistory = (approval: TripApproval) => {
    const request = requestMap.get(approval.tripRequestId);
    if (!request) return;

    setSelectedApproval(approval);
    setSelectedRequest(request);
    setIsHistoryDialogOpen(true);
  };

  const submitApproval = () => {
    // In a real app, this would make an API call
    console.log('Submitting approval:', {
      approvalId: selectedApproval?.id,
      action: approvalAction,
      comments
    });
    setIsApprovalDialogOpen(false);
    setComments('');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; icon: React.ReactNode }> = {
      'Pending': { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      'Approved': { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      'Rejected': { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }
    };
    const config = variants[status] || variants['Pending'];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const getCurrentApprovalStep = (approval: TripApproval) => {
    if (approval.finalStatus !== 'Pending') return null;
    
    const currentStep = approval.approvalWorkflow[approval.currentApprovalLevel - 1];
    return currentStep;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className='p-3'>
          <h1 className='text-2xl'>TRIP APPROVALS</h1>
          <p className="text-muted-foreground text-xs">
            Review and approve pending trip requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.approved}</div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{stats.rejected}</div>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{stats.escalated}</div>
                <p className="text-sm text-muted-foreground">Escalated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
          <CardDescription>
            Trip requests requiring approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search approvals..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Approvals Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Details</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Trip Info</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprovals.map((approval) => {
                const request = requestMap.get(approval.tripRequestId);
                if (!request) return null;

                const currentStep = getCurrentApprovalStep(approval);

                return (
                  <TableRow key={approval.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{approval.requestNumber}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {request.purpose.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Created: {formatDate(approval.createdAt)}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {request.purpose.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{request.requestedBy.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {request.requestedBy.department}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {request.requestedBy.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {request.tripDetails.departureDate}
                        </div>
                        <div className="text-sm flex items-start">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5 text-green-500" />
                          <span className="text-xs">{request.tripDetails.fromLocation.address}</span>
                        </div>
                        <div className="text-sm flex items-start">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5 text-red-500" />
                          <span className="text-xs">{request.tripDetails.toLocation.address}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <UsersIcon className="h-3 w-3 mr-1" />
                          {request.requirements.passengerCount} passenger(s)
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(approval.finalStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm">
                         {formatCost(request.estimatedCost, request.currency)}
                        </span>
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
                          <DropdownMenuItem onClick={() => handleViewHistory(approval)}>
                            <History className="h-4 w-4 mr-2" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Request
                          </DropdownMenuItem>
                          {approval.finalStatus === 'Pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprovalAction(approval, 'approve')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleApprovalAction(approval, 'reject')}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Action Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Trip Request' : 'Reject Trip Request'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  Request: {selectedApproval?.requestNumber} by {selectedRequest.requestedBy.name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Trip Date:</span> {selectedRequest.tripDetails.departureDate}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Cost:</span> {selectedRequest.estimatedCost} {selectedRequest.currency}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Purpose:</span> {selectedRequest.purpose.description}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Route:</span> {selectedRequest.tripDetails.fromLocation.address} → {selectedRequest.tripDetails.toLocation.address}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                placeholder={`Add your ${approvalAction === 'approve' ? 'approval' : 'rejection'} comments...`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitApproval}
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
            >
              {approvalAction === 'approve' ? 'Approve Request' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approval History</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  Request: {selectedApproval?.requestNumber} by {selectedRequest.requestedBy.name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedApproval && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Approval Rules:</span>
                    <ul className="list-disc list-inside mt-1 text-muted-foreground">
                      <li>Cost Threshold: {selectedApproval.approvalRules.costThreshold} {selectedRequest?.currency}</li>
                      <li>Department Approval: {selectedApproval.approvalRules.departmentApprovalRequired ? 'Required' : 'Not Required'}</li>
                      <li>Manager Approval: {selectedApproval.approvalRules.managerApprovalRequired ? 'Required' : 'Not Required'}</li>
                      <li>Finance Approval: {selectedApproval.approvalRules.financeApprovalRequired ? 'Required' : 'Not Required'}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Approval Timeline</h4>
                  {selectedApproval.approvalHistory.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {step.action === 'Approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : step.action === 'Rejected' ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Level {step.level}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(step.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{step.approver.name}</span> ({step.approver.role})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Action: <span className={step.action === 'Approved' ? 'text-green-600' : step.action === 'Rejected' ? 'text-red-600' : ''}>{step.action}</span>
                        </div>
                        {step.comments && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Comments:</span> {step.comments}
                          </div>
                        )}
                        {step.ipAddress && (
                          <div className="text-xs text-muted-foreground">
                            IP: {step.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}