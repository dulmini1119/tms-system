'use client'
import React, { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Car,
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
  RefreshCw,
  Bell
} from 'lucide-react';
import { VehicleDocument } from '@/types/system-interfaces';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockSystemData } from '@/data/mock-system-data';
import { Progress } from '@/components/ui/progress';
import { VariantProps } from 'class-variance-authority';
import { toast } from 'sonner';

export default function VehicleDocuments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'none' | 'riskLevel' | 'complianceScore'>('none');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<VehicleDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editFormData, setEditFormData] = useState({
    documentName: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    notes: '',
  });

  // Get vehicle documents data
  const [vehicleDocuments, setVehicleDocuments] = useState(mockSystemData.vehicleDocuments);

  // Required document types for compliance check
  const requiredDocumentTypes = useMemo(() => [
    'Registration_Certificate',
    'Insurance_Policy',
    'Pollution_Certificate',
    'Fitness_Certificate'
  ], []);

  // Calculate days to expiry
  const calculateDaysToExpiry = (expiryDate?: string): number | undefined => {
    if (!expiryDate) return undefined;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate compliance score
  const calculateComplianceScore = useCallback((doc: VehicleDocument): number => {
    let score = 50;
    if (doc.status === 'Valid') score += 30;
    if (doc.verifiedBy) score += 10;
    const daysToExpiry = calculateDaysToExpiry(doc.expiryDate);
    if (daysToExpiry !== undefined) {
      if (daysToExpiry > 90) score += 10;
      else if (daysToExpiry <= 30) score -= 10;
      else if (daysToExpiry <= 0) score -= 20;
    }
    if (doc.priority === 'High' && doc.status !== 'Valid') score -= 15;
    return Math.max(0, Math.min(100, score));
  }, []);

  // Calculate risk level
  const calculateRiskLevel = useCallback((doc: VehicleDocument): VehicleDocument['riskLevel'] => {
    const daysToExpiry = calculateDaysToExpiry(doc.expiryDate);
    if (doc.status === 'Expired' || doc.status === 'Rejected') return 'Critical';
    if (daysToExpiry !== undefined && daysToExpiry <= 0) return 'Critical';
    if (daysToExpiry !== undefined && daysToExpiry <= 30) return 'High';
    if (daysToExpiry !== undefined && daysToExpiry <= 90) return 'Medium';
    if (!doc.verifiedBy) return 'Medium';
    if (doc.priority === 'High' || doc.priority === 'Critical') return 'Medium';
    return 'Low';
  }, []);

  // Simulate sending reminders and updating audit trail
  const sendReminders = (document: VehicleDocument) => {
    const daysToExpiry = calculateDaysToExpiry(document.expiryDate);
    if (daysToExpiry !== undefined && daysToExpiry <= 30 && document.remindersSent < 3) {
      const updatedDocument = {
        ...document,
        remindersSent: document.remindersSent + 1,
        lastReminderDate: new Date().toISOString(),
        auditTrail: [
          ...document.auditTrail,
          {
            action: 'Reminder Sent',
            performedBy: 'system',
            timestamp: new Date().toISOString(),
            comments: `Reminder ${document.remindersSent + 1} sent for expiring document`
          }
        ]
      };
      setVehicleDocuments(prev => prev.map(doc => doc.id === document.id ? updatedDocument : doc));
      toast.success(`Reminder sent for ${document.documentName}`, {
        description: `Reminder count: ${updatedDocument.remindersSent}`,
        duration: 3000,
      });
    } else {
      toast.error(`Cannot send reminder for ${document.documentName}`, {
        description: daysToExpiry && daysToExpiry > 30 
          ? 'Document not expiring soon enough'
          : 'Maximum reminders reached',
        duration: 3000,
      });
    }
  };

  // Check vehicle compliance
  const checkVehicleCompliance = useCallback(() => {
    const vehicles = [...new Set(vehicleDocuments.map(doc => doc.vehicleNumber))];
    let nonCompliantVehicles = 0;
    vehicles.forEach(vehicle => {
      const vehicleDocs = vehicleDocuments.filter(doc => doc.vehicleNumber === vehicle);
      const hasAllRequired = requiredDocumentTypes.every(type =>
        vehicleDocs.some(doc => doc.documentType === type && doc.status === 'Valid')
      );
      if (!hasAllRequired) nonCompliantVehicles++;
    });
    return nonCompliantVehicles;
  }, [requiredDocumentTypes, vehicleDocuments]);

  // Enhanced filtered documents with sorting
  const filteredDocuments = useMemo(() => {
    let result = vehicleDocuments
      .map(doc => ({
        ...doc,
        daysToExpiry: calculateDaysToExpiry(doc.expiryDate),
        complianceScore: calculateComplianceScore(doc),
        riskLevel: calculateRiskLevel(doc)
      }))
      .filter(doc =>
        (
          doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (statusFilter === 'all' || doc.status.toLowerCase().replace('_', '-') === statusFilter) &&
        (typeFilter === 'all' || doc.documentType.toLowerCase().replace('_', '-') === typeFilter) &&
        (categoryFilter === 'all' || doc.category.toLowerCase() === categoryFilter) &&
        (vehicleFilter === 'all' || doc.vehicleNumber === vehicleFilter) &&
        (riskFilter === 'all' || calculateRiskLevel(doc).toLowerCase() === riskFilter)
      );

    if (sortBy === 'riskLevel') {
      const riskOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      result = result.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    } else if (sortBy === 'complianceScore') {
      result = result.sort((a, b) => b.complianceScore - a.complianceScore);
    }

    return result;
  }, [searchTerm, statusFilter, typeFilter, categoryFilter, vehicleFilter, riskFilter, sortBy, vehicleDocuments, calculateComplianceScore, calculateRiskLevel]);

  // Calculate stats
  const stats = useMemo(() => ({
    totalDocuments: vehicleDocuments.length,
    validDocuments: vehicleDocuments.filter(doc => doc.status === 'Valid').length,
    expiredDocuments: vehicleDocuments.filter(doc => doc.status === 'Expired').length,
    expiringSoon: vehicleDocuments.filter(doc => doc.status === 'Expiring_Soon').length,
    avgComplianceScore: Math.round(filteredDocuments.reduce((sum, doc) => sum + calculateComplianceScore(doc), 0) / filteredDocuments.length) || 0,
    criticalRisk: filteredDocuments.filter(doc => calculateRiskLevel(doc) === 'Critical').length,
    nonCompliantVehicles: checkVehicleCompliance()
  }), [filteredDocuments, calculateComplianceScore, calculateRiskLevel, checkVehicleCompliance, vehicleDocuments]);

  const uniqueVehicles = [...new Set(vehicleDocuments.map(doc => doc.vehicleNumber))];

  const handleViewDetails = (document: VehicleDocument) => {
    setSelectedDocument({
      ...document,
      daysToExpiry: calculateDaysToExpiry(document.expiryDate),
      complianceScore: calculateComplianceScore(document),
      riskLevel: calculateRiskLevel(document)
    });
    setIsDetailsDialogOpen(true);
  };

  // Upload file handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected', {
        description: 'Please select a file to upload.',
        duration: 3000,
      });
      return;
    }

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Only PDF files are allowed.',
        duration: 3000,
      });
      setSelectedFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'File size must be less than 5MB.',
        duration: 3000,
      });
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    toast.success('File Selected', {
      description: `Selected File ${file.name} (${(file.size/1024).toFixed(2)} KB)`,
      duration: 3000,
    });
  };

  const handleDelete = (document: VehicleDocument) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${document.documentName} for ${document.vehicleNumber}?`
    );
    if (confirmDelete) {
      setVehicleDocuments(vehicleDocuments.filter(doc => doc.id !== document.id));
      toast.success(`Document ${document.documentName} deleted`, {
        description: `Document ID: ${document.id} for vehicle ${document.vehicleNumber} has been removed.`,
        duration: 3000,
      });
    }
  };

  const handleDownloadAgreement = (document: VehicleDocument) => {
    if (!document.fileUrl) {
      toast.error('Download Failed', {
        description: `No file available for ${document.documentName}`,
        duration: 3000,
      });
      return;
    }
    try {
      const link = window.document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.fileName || `${document.documentName}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      toast.success('Download Started', {
        description: `Downloading ${document.fileName || document.documentName}`,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Download Failed', {
        description: `Error downloading ${document.documentName}: ${(error as Error).message}`,
        duration: 3000,
      });
    }
  };

  const handleEditDocument = (document: VehicleDocument) => {
    setEditFormData({
      documentName: document.documentName,
      documentNumber: document.documentNumber,
      issueDate: document.issueDate,
      expiryDate: document.expiryDate || '',
      issuingAuthority: document.issuingAuthority,
      notes: document.notes || '',
    });
    setSelectedFile(null);
    setSelectedDocument(document);
    setIsDetailsDialogOpen(true);
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const requiredFields = {
      documentName: editFormData.documentName,
      documentNumber: editFormData.documentNumber,
      issueDate: editFormData.issueDate,
      expiryDate: editFormData.expiryDate,
      issuingAuthority: editFormData.issuingAuthority,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([name, value]) => !value)
      .map(([name]) => name);
    if (missingFields.length > 0) {
      toast.error('Missing required fields', {
        description: `Please fill in: ${missingFields.join(', ')}`,
        duration: 3000,
      });
      return;
    }
    if (!selectedDocument) {
      toast.error('No document selected', {
        description: 'Please try again.',
        duration: 3000,
      });
      return;
    }

    setVehicleDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocument.id ? {
          ...doc,
          documentName: editFormData.documentName,
          documentNumber: editFormData.documentNumber,
          issueDate: editFormData.issueDate,
          expiryDate: editFormData.expiryDate || undefined,
          issuingAuthority: editFormData.issuingAuthority,
          notes: editFormData.notes || undefined,
          fileName: selectedFile?.name || doc.fileName,
          fileType: selectedFile?.type || doc.fileType,
          fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : doc.fileSize,
          fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : doc.fileUrl,
          updatedAt: new Date().toISOString(),
          auditTrail: [
            ...doc.auditTrail,
            {
              action: 'Document Edited',
              performedBy: 'Admin',
              timestamp: new Date().toISOString(),
              comments: 'Document details updated via edit dialog',
            },
          ],
        } : doc
      )
    );
    toast.success(`Document ${editFormData.documentName} updated`, {
      description: `Document ID: ${selectedDocument.id} has been successfully updated.`,
      duration: 3000,
    });
    setIsDetailsDialogOpen(false);
    setSelectedFile(null);
    setSelectedDocument(null);
    setEditFormData({
      documentName: '',
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      notes: '',
    });
  };

  const handleUploadDocument = () => {
    setIsUploadDialogOpen(true);
  };

  // New handler for upload form submission
  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const vehicleNumber = formData.get('vehicle') as string;
    const documentType = formData.get('documentType') as VehicleDocument['documentType'];
    const documentName = formData.get('documentName') as string;
    const documentNumber = formData.get('documentNumber') as string;
    const issueDate = formData.get('issueDate') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const issuingAuthority = formData.get('issuingAuthority') as string;
    const notes = formData.get('notes') as string;

    const requiredFields = {
      Vehicle: vehicleNumber,
      'Document Type': documentType,
      'Document Name': documentName,
      'Document Number': documentNumber,
      'Issue Date': issueDate,
      'Issuing Authority': issuingAuthority,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([name, value]) => !value)
      .map(([name]) => name);
    if (missingFields.length > 0) {
      toast.error('Missing required fields', {
        description: `Please fill in: ${missingFields.join(', ')}`,
        duration: 3000,
      });
      return;
    }

    if (!selectedFile) {
      toast.error('No file selected', {
        description: 'Please select a PDF file to upload.',
        duration: 3000,
      });
      return;
    }

    // Map documentType to category
    const categoryMap: Record<string, VehicleDocument['category']> = {
      Registration_Certificate: 'Legal',
      Insurance_Policy: 'Insurance',
      Pollution_Certificate: 'Compliance',
      Fitness_Certificate: 'Compliance',
      Route_Permit: 'Legal',
      Tax_Receipt: 'Financial',
      Service_Record: 'Maintenance',
      Inspection_Report: 'Compliance',
      Ownership_Transfer: 'Legal',
      Hypothecation: 'Financial',
      No_Objection_Certificate: 'Legal',
    };
    const category = categoryMap[documentType] || 'Compliance';

    const newDocument: VehicleDocument = {
      id: `doc-${Date.now()}`,
      vehicleId: `veh-${Date.now()}`,
      vehicleNumber,
      vehicleMake: 'Unknown',
      vehicleModel: 'Unknown',
      documentType,
      documentName,
      documentNumber,
      category,
      priority: 'Medium',
      status: 'Pending_Verification',
      issueDate,
      expiryDate: expiryDate || undefined,
      issuingAuthority,
      notes: notes || undefined,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: `${(selectedFile.size / 1024).toFixed(2)} KB`,
      fileUrl: URL.createObjectURL(selectedFile),
      uploadedBy: 'Admin',
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      remindersSent: 0,
      auditTrail: [{
        action: 'Document Uploaded',
        performedBy: 'Admin',
        timestamp: new Date().toISOString(),
        comments: 'New document uploaded',
      }],
      attachments: [],
    };

    setVehicleDocuments(prev => [...prev, newDocument]);
    toast.success('Document Uploaded', {
      description: `Document ${documentName} for vehicle ${vehicleNumber} has been uploaded.`,
      duration: 3000,
    });
    setIsUploadDialogOpen(false);
    setSelectedFile(null);
  };

  // Handler for renewing document
  const handleRenewDocument = (document: VehicleDocument) => {
    setVehicleDocuments(prev =>
      prev.map(doc =>
        doc.id === document.id ? {
          ...doc,
          status: 'Under_Renewal',
          updatedAt: new Date().toISOString(),
          auditTrail: [
            ...doc.auditTrail,
            {
              action: 'Document Renewal Initiated',
              performedBy: 'Admin',
              timestamp: new Date().toISOString(),
              comments: 'Document marked for renewal',
            },
          ],
        } : doc
      )
    );
    toast.success(`Renewal initiated for ${document.documentName}`, {
      description: `Document ID: ${document.id} marked as Under Renewal.`,
      duration: 3000,
    });
  };

  // Handler for verifying document
  const handleVerifyDocument = (document: VehicleDocument) => {
    setVehicleDocuments(prev =>
      prev.map(doc =>
        doc.id === document.id ? {
          ...doc,
          status: 'Valid',
          verifiedBy: 'Admin',
          verifiedAt: new Date().toISOString(),
          verificationComments: 'Document verified by admin',
          auditTrail: [
            ...doc.auditTrail,
            {
              action: 'Document Verified',
              performedBy: 'Admin',
              timestamp: new Date().toISOString(),
              comments: 'Document verification completed',
            },
          ],
        } : doc
      )
    );
    toast.success(`Document ${document.documentName} verified`, {
      description: `Document ID: ${document.id} has been marked as Valid.`,
      duration: 3000,
    });
  };

  const handleSendReminders = () => {
    filteredDocuments.forEach(sendReminders);
    toast.success('Reminders Processed', {
      description: 'All eligible reminders have been sent.',
      duration: 3000,
    });
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysToExpiryColor = (days: number | undefined) => {
    if (days === undefined) return 'text-gray-600';
    if (days < 0) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    if (days <= 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className='p-3'>
          <h1 className='text-2xl'>VEHICLE DOCUMENTS</h1>
          <p className="text-muted-foreground text-xs">
            Manage vehicle registration, insurance, and compliance documents
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
          <Button onClick={handleSendReminders}>
            <Bell className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.criticalRisk}</div>
                <p className="text-sm text-muted-foreground">Critical Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Document Management</CardTitle>
          <CardDescription>
            Registration, insurance, compliance, and maintenance documents for all vehicles
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
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {uniqueVehicles.map(vehicle => (
                  <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
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
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="registration-certificate">Registration Certificate</SelectItem>
                <SelectItem value="insurance-policy">Insurance Policy</SelectItem>
                <SelectItem value="pollution-certificate">Pollution Certificate</SelectItem>
                <SelectItem value="fitness-certificate">Fitness Certificate</SelectItem>
                <SelectItem value="service-record">Service Record</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: 'none' | 'riskLevel' | 'complianceScore') => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="riskLevel">Risk Level</SelectItem>
                <SelectItem value="complianceScore">Compliance Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle & Document</TableHead>
                <TableHead>Document Details</TableHead>
                <TableHead>Validity & Status</TableHead>
                <TableHead>Compliance & Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center">
                        <Car className="h-3 w-3 mr-1" />
                        {document.vehicleNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {document.vehicleMake} {document.vehicleModel}
                      </div>
                      <div className="text-sm font-medium">{document.documentName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {document.documentNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {document.issuingAuthority}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        File: {document.fileName}
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Progress value={document.complianceScore} className="w-16 h-2" />
                        <span className="text-sm">{document.complianceScore}%</span>
                      </div>
                      {getRiskBadge(document.riskLevel)}
                      <div className="text-xs text-muted-foreground">
                        Compliance Score
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Reminders: {document.remindersSent}
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
                        <DropdownMenuItem onClick={() => handleDownloadAgreement(document)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDocument(document)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => sendReminders(document)}>
                          <Bell className="h-4 w-4 mr-2" />
                          Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRenewDocument(document)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVerifyDocument(document)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(document)}>
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
      <Dialog open={isDetailsDialogOpen} onOpenChange={(open) => {
        setIsDetailsDialogOpen(open);
        if (!open) {
          setSelectedFile(null);
          setSelectedDocument(null);
          setEditFormData({
            documentName: '',
            documentNumber: '',
            issueDate: '',
            expiryDate: '',
            issuingAuthority: '',
            notes: '',
          });
        }
      }}>
        <DialogContent className="sm:max-w-[825px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle Document</DialogTitle>
            <DialogDescription>
              {selectedDocument && (
                <>
                  Edit details for {selectedDocument.documentName} - {selectedDocument.vehicleNumber}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input
                  name="documentName"
                  value={editFormData.documentName}
                  onChange={handleFormChange}
                  placeholder="Enter document name"
                />
              </div>
              <div className="space-y-2">
                <Label>Document Number</Label>
                <Input
                  name="documentNumber"
                  value={editFormData.documentNumber}
                  onChange={handleFormChange}
                  placeholder="Enter document number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    name="issueDate"
                    value={editFormData.issueDate}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    name="expiryDate"
                    value={editFormData.expiryDate}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Issuing Authority</Label>
                <Input
                  name="issuingAuthority"
                  value={editFormData.issuingAuthority}
                  onChange={handleFormChange}
                  placeholder="Enter issuing authority"
                />
              </div>
              <div className="space-y-2">
                <Label>File Upload (Optional)</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="border-2 border-dashed border-muted rounded-lg p-4"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleFormChange}
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Upload Vehicle Document</DialogTitle>
            <DialogDescription>
              Upload a new document for vehicle compliance and record keeping
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select name="vehicle">
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueVehicles.map(vehicle => (
                      <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select name="documentType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Registration_Certificate">Registration Certificate</SelectItem>
                    <SelectItem value="Insurance_Policy">Insurance Policy</SelectItem>
                    <SelectItem value="Pollution_Certificate">Pollution Certificate</SelectItem>
                    <SelectItem value="Fitness_Certificate">Fitness Certificate</SelectItem>
                    <SelectItem value="Route_Permit">Route Permit</SelectItem>
                    <SelectItem value="Tax_Receipt">Tax Receipt</SelectItem>
                    <SelectItem value="Service_Record">Service Record</SelectItem>
                    <SelectItem value="Inspection_Report">Inspection Report</SelectItem>
                    <SelectItem value="Ownership_Transfer">Ownership Transfer</SelectItem>
                    <SelectItem value="Hypothecation">Hypothecation</SelectItem>
                    <SelectItem value="No_Objection_Certificate">No Objection Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input name="documentName" placeholder="Enter document name" />
            </div>
            <div className="space-y-2">
              <Label>Document Number</Label>
              <Input name="documentNumber" placeholder="Enter document number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input name="issueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input name="expiryDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Issuing Authority</Label>
              <Input name="issuingAuthority" placeholder="Enter issuing authority" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentFile">File Upload</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Input 
                  id="documentFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="documentFile"
                  className="flex flex-col items-center justify-center w-full h-28 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 text-center"
                >
                  <Upload className="h-6 w-6 mb-2 text-blue-500" />
                  <span className="text-sm">Click or drag file to upload</span>
                  <span className="text-xs text-gray-400 mt-1">
                    Only PDF files are allowed
                  </span>
                </label>
                <p className="text-sm text-muted-foreground">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : 'Drop document here or click to browse'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                name="notes"
                placeholder="Add any additional notes about this document..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Upload Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}