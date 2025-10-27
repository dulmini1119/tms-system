'use client'
import React, { useState } from 'react';

import { 
  FileText, 
  User, 
  Upload, 
  Download, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  DollarSign,
  Phone,
  Star,
  RefreshCw,
  Archive,
  Heart,
  GraduationCap,
  CreditCard
} from 'lucide-react';
import { DriverDocument } from '@/types/system-interfaces';
import { mockSystemData } from '@/data/mock-system-data';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VariantProps } from 'class-variance-authority';

export default function DriverDocuments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DriverDocument | null>(null);

  // Get driver documents data
  const driverDocuments = mockSystemData.driverDocuments;

  const filteredDocuments = driverDocuments.filter(doc => {
    return (
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (statusFilter === 'all' || doc.status.toLowerCase().replace('_', '-') === statusFilter) &&
    (typeFilter === 'all' || doc.documentType.toLowerCase().replace('_', '-') === typeFilter) &&
    (categoryFilter === 'all' || doc.category.toLowerCase() === categoryFilter) &&
    (driverFilter === 'all' || doc.driverName === driverFilter);
  });

  // Calculate stats
  const stats = {
    totalDocuments: driverDocuments.length,
    validDocuments: driverDocuments.filter(doc => doc.status === 'Valid').length,
    expiredDocuments: driverDocuments.filter(doc => doc.status === 'Expired').length,
    expiringSoon: driverDocuments.filter(doc => doc.status === 'Expiring_Soon').length,
    avgComplianceScore: Math.round(driverDocuments.reduce((sum, doc) => sum + doc.complianceScore, 0) / driverDocuments.length),
    criticalRisk: driverDocuments.filter(doc => doc.riskLevel === 'Critical').length
  };

  // Get unique driver names for filter
  const uniqueDrivers = [...new Set(driverDocuments.map(doc => doc.driverName))];

  const handleViewDetails = (document: DriverDocument) => {
    setSelectedDocument(document);
    setIsDetailsDialogOpen(true);
  };

  const handleUploadDocument = () => {
    setIsUploadDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; icon: React.ReactNode }> = {
      'Valid': { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      'Expired': { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      'Expiring_Soon': { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      'Under_Renewal': { variant: 'outline', icon: <RefreshCw className="h-3 w-3" /> },
      'Rejected': { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      'Pending_Verification': { variant: 'secondary', icon: <Clock className="h-3 w-3" /> }
    };
    const config = variants[status] || variants['Valid'];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; icon: React.ReactNode; color: string }> = {
      'Low': { variant: 'outline', icon: <Shield className="h-3 w-3" />, color: 'text-green-600' },
      'Medium': { variant: 'secondary', icon: <AlertTriangle className="h-3 w-3" />, color: 'text-yellow-600' },
      'High': { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" />, color: 'text-orange-600' },
      'Critical': { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" />, color: 'text-red-600' }
    };
    const config = variants[riskLevel] || variants['Low'];
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {riskLevel}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; color: string; icon: React.ReactNode }> = {
      'Legal': { variant: 'default', color: 'text-blue-600', icon: <FileText className="h-3 w-3" /> },
      'Medical': { variant: 'secondary', color: 'text-red-600', icon: <Heart className="h-3 w-3" /> },
      'Training': { variant: 'outline', color: 'text-purple-600', icon: <GraduationCap className="h-3 w-3" /> },
      'Verification': { variant: 'default', color: 'text-green-600', icon: <Shield className="h-3 w-3" /> },
      'Insurance': { variant: 'secondary', color: 'text-orange-600', icon: <CreditCard className="h-3 w-3" /> },
      'Identity': { variant: 'outline', color: 'text-gray-600', icon: <User className="h-3 w-3" /> }
    };
    const config = variants[category] || variants['Legal'];
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {category}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number | undefined, currency: string = 'LKR') => {
    if (!amount) return 'N/A';
    return `${currency === 'LKR' ? 'Rs.' : '$'}${amount.toLocaleString()}`;
  };

  const getDaysToExpiryColor = (days: number | undefined) => {
    if (days === undefined) return 'text-gray-600';
    if (days < 0) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    if (days <= 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Driver Documents</h1>
          <p className="text-muted-foreground">
            Manage driver licenses, medical certificates, training records, and compliance documents
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.validDocuments}</div>
                <p className="text-sm text-muted-foreground">Valid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{stats.expiredDocuments}</div>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.expiringSoon}</div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.avgComplianceScore}%</div>
                <p className="text-sm text-muted-foreground">Avg Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.criticalRisk}</div>
                <p className="text-sm text-muted-foreground">Critical Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Document Management</CardTitle>
          <CardDescription>
            Licenses, medical certificates, training records, and verification documents for all drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={driverFilter} onValueChange={setDriverFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                {uniqueDrivers.map(driver => (
                  <SelectItem key={driver} value={driver}>{driver}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                <SelectItem value="under-renewal">Under Renewal</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending-verification">Pending Verification</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="driving-license">Driving License</SelectItem>
                <SelectItem value="medical-certificate">Medical Certificate</SelectItem>
                <SelectItem value="police-verification">Police Verification</SelectItem>
                <SelectItem value="training-certificate">Training Certificate</SelectItem>
                <SelectItem value="insurance-policy">Insurance Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver & Document</TableHead>
                <TableHead>Document Details</TableHead>
                <TableHead>Validity & Status</TableHead>
                <TableHead>Compliance & Risk</TableHead>
                <TableHead>Renewal Info</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {document.driverName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {document.driverEmployeeId}
                      </div>
                      <div className="text-sm font-medium">{document.documentName}</div>
                      {getCategoryBadge(document.category)}
                      <div className="text-xs text-muted-foreground">
                        License: {document.licenseNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {document.documentNumber || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {document.issuingAuthority}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Type: {document.documentType.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        File: {document.fileName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Size: {document.fileSize} • {document.fileType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(document.status)}
                      <div className="text-sm">
                        Issued: {formatDate(document.issueDate)}
                      </div>
                      {document.expiryDate && (
                        <div className="text-sm">
                          Expires: {formatDate(document.expiryDate)}
                        </div>
                      )}
                      {document.daysToExpiry !== undefined && (
                        <div className={`text-sm ${getDaysToExpiryColor(document.daysToExpiry)}`}>
                          {document.daysToExpiry < 0 
                            ? `Overdue by ${Math.abs(document.daysToExpiry)} days`
                            : `${document.daysToExpiry} days left`
                          }
                        </div>
                      )}
                      {document.validityPeriod && (
                        <div className="text-xs text-muted-foreground">
                          Validity: {document.validityPeriod} year(s)
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Progress value={document.complianceScore} className="w-16 h-2" />
                        <span className="text-sm">{document.complianceScore}%</span>
                      </div>
                      {getRiskBadge(document.riskLevel)}
                      {document.score && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Score: {document.score}%
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Reminders: {document.remindersSent}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {document.renewalCost && (
                        <div className="text-sm flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(document.renewalCost, document.currency)}
                        </div>
                      )}
                      {document.vendor && (
                        <div className="text-xs text-muted-foreground">
                          Vendor: {document.vendor}
                        </div>
                      )}
                      {document.medicalCenter && (
                        <div className="text-xs text-muted-foreground">
                          Center: {document.medicalCenter.split(',')[0]}
                        </div>
                      )}
                      {document.trainingInstitute && (
                        <div className="text-xs text-muted-foreground">
                          Institute: {document.trainingInstitute.split(',')[0]}
                        </div>
                      )}
                      {document.contactNumber && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {document.contactNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Uploaded by: {document.uploadedBy.split('@')[0]}
                      </div>
                      {document.verifiedBy && (
                        <>
                          <div className="text-xs text-green-600">
                            ✓ Verified by: {document.verifiedBy.split('@')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(document.verifiedAt || '')}
                          </div>
                        </>
                      )}
                      {document.certificationLevel && (
                        <div className="text-xs text-blue-600">
                          {document.certificationLevel}
                        </div>
                      )}
                      <div className="text-xs">
                        Attachments: {document.attachments.length}
                      </div>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(document)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
        </CardContent>
      </Card>

      {/* Document Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[825px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Driver Document Details</DialogTitle>
            <DialogDescription>
              {selectedDocument && (
                <>
                  Complete information for {selectedDocument.documentName} - {selectedDocument.driverName}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedDocument && (
              <>
                {/* Document Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedDocument.complianceScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">Compliance Score</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getDaysToExpiryColor(selectedDocument.daysToExpiry)}`}>
                          {selectedDocument.daysToExpiry !== undefined
                            ? selectedDocument.daysToExpiry < 0
                              ? `${Math.abs(selectedDocument.daysToExpiry)} days overdue`
                              : `${selectedDocument.daysToExpiry} days left`
                            : 'No Expiry'
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">Expiry Status</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDocument.score || 'N/A'}
                          {selectedDocument.score && '%'}
                        </div>
                        <div className="text-sm text-muted-foreground">Performance Score</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Driver Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">Driver Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Driver Name: {selectedDocument.driverName}</div>
                    <div>Employee ID: {selectedDocument.driverEmployeeId}</div>
                    <div>Driver ID: {selectedDocument.driverId}</div>
                    <div>License Number: {selectedDocument.licenseNumber}</div>
                  </div>
                </div>

                {/* Document Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">Document Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Document Type: {selectedDocument.documentType.replace('_', ' ')}</div>
                    <div>Document Number: {selectedDocument.documentNumber || 'N/A'}</div>
                    <div>Document Name: {selectedDocument.documentName}</div>
                    <div>Category: {selectedDocument.category}</div>
                    <div>Priority: {selectedDocument.priority}</div>
                    <div>Status: {selectedDocument.status.replace('_', ' ')}</div>
                    <div>Risk Level: {selectedDocument.riskLevel}</div>
                    <div>Issuing Authority: {selectedDocument.issuingAuthority}</div>
                  </div>
                </div>

                {/* Validity Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">Validity Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Issue Date: {formatDate(selectedDocument.issueDate)}</div>
                    <div>Expiry Date: {formatDate(selectedDocument.expiryDate || '')}</div>
                    <div>Days to Expiry: {selectedDocument.daysToExpiry !== undefined 
                      ? selectedDocument.daysToExpiry < 0 
                        ? `Overdue by ${Math.abs(selectedDocument.daysToExpiry)} days`
                        : `${selectedDocument.daysToExpiry} days`
                      : 'No Expiry'
                    }</div>
                    <div>Validity Period: {selectedDocument.validityPeriod ? `${selectedDocument.validityPeriod} year(s)` : 'N/A'}</div>
                    <div>Compliance Score: {selectedDocument.complianceScore}%</div>
                    <div>Performance Score: {selectedDocument.score ? `${selectedDocument.score}%` : 'N/A'}</div>
                  </div>
                </div>

                {/* Certification Information */}
                {(selectedDocument.certificationLevel || selectedDocument.medicalCenter || selectedDocument.trainingInstitute) && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Certification Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedDocument.certificationLevel && (
                        <div>Certification Level: {selectedDocument.certificationLevel}</div>
                      )}
                      {selectedDocument.medicalCenter && (
                        <div>Medical Center: {selectedDocument.medicalCenter}</div>
                      )}
                      {selectedDocument.trainingInstitute && (
                        <div>Training Institute: {selectedDocument.trainingInstitute}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* File Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">File Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>File Name: {selectedDocument.fileName}</div>
                    <div>File Size: {selectedDocument.fileSize}</div>
                    <div>File Type: {selectedDocument.fileType}</div>
                    <div>File URL: {selectedDocument.fileUrl}</div>
                  </div>
                </div>

                {/* Upload & Verification Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">Upload & Verification</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Uploaded By: {selectedDocument.uploadedBy}</div>
                    <div>Uploaded At: {formatDate(selectedDocument.uploadedAt)}</div>
                    <div>Verified By: {selectedDocument.verifiedBy || 'Not Verified'}</div>
                    <div>Verified At: {formatDate(selectedDocument.verifiedAt || '')}</div>
                  </div>
                  {selectedDocument.verificationComments && (
                    <div className="text-sm">
                      <span className="font-medium">Verification Comments:</span>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {selectedDocument.verificationComments}
                      </div>
                    </div>
                  )}
                </div>

                {/* Renewal Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">Renewal Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Renewal Cost: {formatCurrency(selectedDocument.renewalCost, selectedDocument.currency)}</div>
                    <div>Currency: {selectedDocument.currency || 'N/A'}</div>
                    <div>Vendor: {selectedDocument.vendor || 'N/A'}</div>
                    <div>Contact Number: {selectedDocument.contactNumber || 'N/A'}</div>
                    <div>Reminders Sent: {selectedDocument.remindersSent}</div>
                    <div>Last Reminder: {formatDate(selectedDocument.lastReminderDate || '')}</div>
                  </div>
                </div>

                {/* Notes */}
                {selectedDocument.notes && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Notes</h4>
                    <div className="text-sm p-3 bg-muted rounded-lg">
                      {selectedDocument.notes}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedDocument.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Attachments ({selectedDocument.attachments.length})</h4>
                    <div className="space-y-1">
                      {selectedDocument.attachments.map((attachment, index) => (
                        <div key={index} className="text-sm flex items-center">
                          <FileText className="h-3 w-3 mr-2" />
                          {attachment}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Trail */}
                {selectedDocument.auditTrail.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Audit Trail</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {selectedDocument.auditTrail.map((entry, index) => (
                        <div key={index} className="border rounded-lg p-2 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{entry.action}</div>
                              <div className="text-muted-foreground">By: {entry.performedBy}</div>
                            </div>
                            <div className="text-muted-foreground text-right">
                              {formatDate(entry.timestamp)}
                            </div>
                          </div>
                          {entry.comments && (
                            <div className="mt-1 text-muted-foreground">
                              {entry.comments}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">System Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Document ID: {selectedDocument.id}</div>
                    <div>Created: {formatDate(selectedDocument.createdAt)}</div>
                    <div>Last Updated: {formatDate(selectedDocument.updatedAt)}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload Driver Document</DialogTitle>
            <DialogDescription>
              Upload a new document for driver compliance and record keeping
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDrivers.map(driver => (
                      <SelectItem key={driver} value={driver}>{driver}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driving-license">Driving License</SelectItem>
                    <SelectItem value="medical-certificate">Medical Certificate</SelectItem>
                    <SelectItem value="police-verification">Police Verification</SelectItem>
                    <SelectItem value="training-certificate">Training Certificate</SelectItem>
                    <SelectItem value="insurance-policy">Insurance Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input placeholder="Enter document name" />
            </div>
            <div className="space-y-2">
              <Label>Document Number (Optional)</Label>
              <Input placeholder="Enter document number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Issuing Authority</Label>
              <Input placeholder="Enter issuing authority" />
            </div>
            <div className="space-y-2">
              <Label>File Upload</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop document here or click to browse
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any additional notes about this document..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(false)}>
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}