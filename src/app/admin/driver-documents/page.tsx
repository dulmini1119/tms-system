'use client';
import React, { useState, useCallback } from 'react';
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
  Star,
  RefreshCw,
  Archive,
  Heart,
  GraduationCap,
  CreditCard,
} from 'lucide-react';
import { DriverDocument } from '@/types/system-interfaces';
import { mockSystemData } from '@/data/mock-system-data';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VariantProps } from 'class-variance-authority';
import { toast } from 'sonner';

export default function DriverDocuments() {
  /* -------------------------- STATE -------------------------- */
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DriverDocument | null>(null);

  const [DriverDocuments, setDriverDocuments] = useState<DriverDocument[]>(
    mockSystemData.driverDocuments
  );

  const documentTypeMap: Record<string, DriverDocument['documentType']> = {
    'driving-license': 'Driving_License',
    'medical-certificate': 'Medical_Certificate',
    'police-verification': 'Police_Verification',
    'training-certificate': 'Training_Certificate',
    'insurance-policy': 'Insurance_Policy',
  };

  /* Upload form */
  const [uploadForm, setUploadForm] = useState({
    driverName: '',
    documentType: '',
    documentName: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    notes: '',
  });

  /* Edit form */
  const [editFormData, setEditFormData] = useState<Partial<DriverDocument>>({
    documentName: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    notes: '',
    verifiedBy: '',
    verifiedAt: '',
    renewalCost: 0,
    currency: 'LKR',
    vendor: '',
    contactNumber: '',
    priority: 'Low' as const,
  });

  /* -------------------------- DERIVED DATA -------------------------- */
  const calculateDaysToExpiry = (expiryDate?: string): number | undefined => {
    if (!expiryDate) return undefined;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateComplianceScore = (doc: DriverDocument): number => {
    let score = 50;
    if (doc.status === 'Valid') score += 30;
    if (doc.verifiedBy) score += 10;
    const days = calculateDaysToExpiry(doc.expiryDate);
    if (days !== undefined) {
      if (days > 90) score += 10;
      else if (days <= 30) score -= 10;
      else if (days <= 0) score -= 20;
    }
    if (doc.priority === 'High' && doc.status !== 'Valid') score -= 15;
    return Math.max(0, Math.min(100, score));
  };

  const calculateRiskLevel = (doc: DriverDocument): DriverDocument['riskLevel'] => {
    const days = calculateDaysToExpiry(doc.expiryDate);
    if (doc.status === 'Expired' || doc.status === 'Rejected') return 'Critical';
    if (days !== undefined && days <= 0) return 'Critical';
    if (days !== undefined && days <= 30) return 'High';
    if (days !== undefined && days <= 90) return 'Medium';
    if (!doc.verifiedBy) return 'Medium';
    if (doc.priority === 'High' || doc.priority === 'Critical') return 'Medium';
    return 'Low';
  };

  const enrichDocument = (doc: DriverDocument): DriverDocument => ({
    ...doc,
    daysToExpiry: calculateDaysToExpiry(doc.expiryDate),
    complianceScore: calculateComplianceScore(doc),
    riskLevel: calculateRiskLevel(doc),
  });

  const filteredDocuments = DriverDocuments.map(enrichDocument).filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      doc.status.toLowerCase().replace('_', '-') === statusFilter;
    const matchesType =
      typeFilter === 'all' ||
      doc.documentType.toLowerCase().replace('_', '-') === typeFilter;
    const matchesCategory =
      categoryFilter === 'all' || doc.category.toLowerCase() === categoryFilter;
    const matchesDriver =
      driverFilter === 'all' || doc.driverName === driverFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesDriver;
  });

  const stats = {
    totalDocuments: DriverDocuments.length,
    validDocuments: DriverDocuments.filter((d) => d.status === 'Valid').length,
    expiredDocuments: DriverDocuments.filter((d) => d.status === 'Expired').length,
    expiringSoon: DriverDocuments.filter((d) => d.status === 'Expiring_Soon').length,
    avgComplianceScore: Math.round(
      DriverDocuments.reduce((s, d) => s + calculateComplianceScore(d), 0) /
        DriverDocuments.length
    ),
    criticalRisk: DriverDocuments.filter((d) => calculateRiskLevel(d) === 'Critical').length,
  };

  const uniqueDrivers = [...new Set(DriverDocuments.map((d) => d.driverName))];

  /* -------------------------- HANDLERS -------------------------- */

  const handleViewDetails = (document: DriverDocument) => {
    setSelectedDocument(enrichDocument(document));
    setIsDetailsDialogOpen(true);
  };

  const handleDownload = (document: DriverDocument) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    } else {
      toast.error('No file available for download');
    }
  };

  const handleEdit = (document: DriverDocument) => {
    setSelectedDocument(document);
    setEditFormData({
      ...document,
      issueDate: document.issueDate.split('T')[0],
      expiryDate: document.expiryDate?.split('T')[0] ?? '',
      renewalCost: document.renewalCost ?? 0,
      priority: document.priority,
    });
    setIsEditMode(true);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmit = useCallback(() => {
    if (!selectedDocument) {
      toast.error('No document selected');
      return;
    }

    const required = {
      documentName: editFormData.documentName?.trim(),
      documentNumber: editFormData.documentNumber?.trim(),
      issueDate: editFormData.issueDate,
      expiryDate: editFormData.expiryDate,
      issuingAuthority: editFormData.issuingAuthority?.trim(),
    };

    const missing = Object.entries(required)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) {
      toast.error('Missing required fields', {
        description: `Please fill: ${missing.join(', ')}`,
      });
      return;
    }

    const updated: DriverDocument = {
      ...selectedDocument,
      documentName: editFormData.documentName!,
      documentNumber: editFormData.documentNumber!,
      issueDate: new Date(editFormData.issueDate!).toISOString(),
      expiryDate: editFormData.expiryDate ? new Date(editFormData.expiryDate).toISOString() : undefined,
      issuingAuthority: editFormData.issuingAuthority!,
      notes: editFormData.notes || undefined,
      verifiedBy: editFormData.verifiedBy || undefined,
      verifiedAt: editFormData.verifiedAt || undefined,
      renewalCost: editFormData.renewalCost! > 0 ? editFormData.renewalCost : undefined,
      currency: editFormData.currency || undefined,
      vendor: editFormData.vendor || undefined,
      contactNumber: editFormData.contactNumber || undefined,
      priority: (editFormData.priority as DriverDocument['priority']) || 'Medium',

      fileName: selectedFile?.name || selectedDocument.fileName,
      fileType: selectedFile?.type || selectedDocument.fileType,
      fileSize: selectedFile
        ? `${(selectedFile.size / 1024).toFixed(2)} KB`
        : selectedDocument.fileSize,
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : selectedDocument.fileUrl,

      updatedAt: new Date().toISOString(),
      auditTrail: [
        ...selectedDocument.auditTrail,
        {
          action: 'Document Edited',
          performedBy: 'Admin',
          timestamp: new Date().toISOString(),
          comments: 'Updated via edit dialog',
        },
      ],
    };

    setDriverDocuments((prev) =>
      prev.map((d) => (d.id === selectedDocument.id ? updated : d))
    );

    toast.success(`${updated.documentName} updated`, {
      description: `ID: ${updated.id}`,
    });

    setIsDetailsDialogOpen(false);
    setIsEditMode(false);
    setSelectedFile(null);
    setSelectedDocument(null);
    setEditFormData({
      documentName: '',
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      notes: '',
      verifiedBy: '',
      verifiedAt: '',
      renewalCost: 0,
      currency: 'LKR',
      vendor: '',
      contactNumber: '',
      priority: 'Low',
    });
  }, [editFormData, selectedDocument, selectedFile]);

  const handleVerify = (document: DriverDocument) => {
    const updated = {
      ...document,
      status: 'Valid' as const,
      verifiedBy: 'Admin User',
      verifiedAt: new Date().toISOString(),
    };
    setDriverDocuments((prev) =>
      prev.map((d) => (d.id === document.id ? updated : d))
    );
    toast.success('Document verified');
  };

  const handleDelete = (document: DriverDocument) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setDriverDocuments((prev) => prev.filter((d) => d.id !== document.id));
    toast.success('Document deleted');
  };

  const handleUploadSubmit = () => {
    const { driverName, documentType, documentName, documentNumber, issueDate, expiryDate, issuingAuthority, notes } = uploadForm;

    if (!driverName || !documentType || !documentName || !issueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const mappedDocType = documentTypeMap[documentType];
    if (!mappedDocType) {
      toast.error('Invalid document type');
      return;
    }

    const newDoc: DriverDocument = {
      id: `doc-${Date.now()}`,
      driverName,
      driverEmployeeId: 'EMP-' + Math.floor(Math.random() * 1000),
      driverId: 'DRV-' + Math.floor(Math.random() * 1000),
      licenseNumber: 'LIC-' + Math.floor(Math.random() * 10000),
      documentName,
      documentNumber: documentNumber || undefined,
      documentType: mappedDocType,
      category: 'Legal',
      priority: 'Medium',
      status: 'Pending_Verification',
      issueDate: new Date(issueDate).toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      daysToExpiry: expiryDate ? calculateDaysToExpiry(expiryDate) : undefined,
      validityPeriod: expiryDate
        ? Math.round((new Date(expiryDate).getTime() - new Date(issueDate).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : undefined,
      issuingAuthority,
      complianceScore: 0,
      riskLevel: 'Low',
      score: undefined,
      remindersSent: 0,
      lastReminderDate: undefined,
      fileName: 'uploaded-file.pdf',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      fileUrl: '#',
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      verifiedBy: undefined,
      verifiedAt: undefined,
      verificationComments: undefined,
      renewalCost: undefined,
      currency: undefined,
      vendor: undefined,
      contactNumber: undefined,
      notes,
      certificationLevel: undefined,
      medicalCenter: undefined,
      trainingInstitute: undefined,
      attachments: [],
      auditTrail: [
        {
          action: 'Document Uploaded',
          performedBy: 'Current User',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDriverDocuments((prev) => [...prev, newDoc]);
    setIsUploadDialogOpen(false);
    setUploadForm({
      driverName: '',
      documentType: '',
      documentName: '',
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      notes: '',
    });
    toast.success('Document uploaded successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    setSelectedFile(file);
    toast.success('File selected', { description: `${file.name}` });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'renewalCost') {
      setEditFormData((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* -------------------------- BADGES & HELPERS -------------------------- */
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; icon: React.ReactNode }> = {
      Valid: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      Expired: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      Expiring_Soon: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      Under_Renewal: { variant: 'outline', icon: <RefreshCw className="h-3 w-3" /> },
      Rejected: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      Pending_Verification: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      Archived: { variant: 'outline', icon: <Archive className="h-3 w-3" /> },
    };
    const cfg = variants[status] ?? variants['Valid'];
    return (
      <Badge variant={cfg.variant} className="flex items-center gap-1">
        {cfg.icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; icon: React.ReactNode; color: string }> = {
      Low: { variant: 'outline', icon: <Shield className="h-3 w-3" />, color: 'text-green-600' },
      Medium: { variant: 'secondary', icon: <AlertTriangle className="h-3 w-3" />, color: 'text-yellow-600' },
      High: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" />, color: 'text-orange-600' },
      Critical: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" />, color: 'text-red-600' },
    };
    const cfg = variants[riskLevel] ?? variants['Low'];
    return (
      <Badge variant={cfg.variant} className={`flex items-center gap-1 ${cfg.color}`}>
        {cfg.icon}
        {riskLevel}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { variant: VariantProps<typeof badgeVariants>['variant']; color: string; icon: React.ReactNode }> = {
      Legal: { variant: 'default', color: 'text-blue-600', icon: <FileText className="h-3 w-3" /> },
      Medical: { variant: 'secondary', color: 'text-red-600', icon: <Heart className="h-3 w-3" /> },
      Training: { variant: 'outline', color: 'text-purple-600', icon: <GraduationCap className="h-3 w-3" /> },
      Verification: { variant: 'default', color: 'text-green-600', icon: <Shield className="h-3 w-3" /> },
      Insurance: { variant: 'secondary', color: 'text-orange-600', icon: <CreditCard className="h-3 w-3" /> },
      Identity: { variant: 'outline', color: 'text-gray-600', icon: <User className="h-3 w-3" /> },
    };
    const cfg = variants[category] ?? variants['Legal'];
    return (
      <Badge variant={cfg.variant} className={`flex items-center gap-1 ${cfg.color}`}>
        {cfg.icon}
        {category}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysToExpiryColor = (days: number | undefined) => {
    if (days === undefined) return 'text-gray-600';
    if (days < 0) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    if (days <= 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  /* -------------------------- RENDER -------------------------- */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="p-3">
          <h1 className="text-2xl">DRIVER DOCUMENTS</h1>
          <p className="text-muted-foreground text-xs">
            Manage driver licenses, medical certificates, training records, and compliance documents
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: FileText, label: 'Total', value: stats.totalDocuments, color: 'text-blue-500' },
          { icon: CheckCircle, label: 'Valid', value: stats.validDocuments, color: 'text-green-500' },
          { icon: XCircle, label: 'Expired', value: stats.expiredDocuments, color: 'text-red-500' },
          { icon: AlertTriangle, label: 'Critical Risk', value: stats.criticalRisk, color: 'text-red-600' },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-2">
              <s.icon className={`h-6 w-6 ${s.color}`} />
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Document Management</CardTitle>
          <CardDescription>Licenses, medical certificates, training records, and verification documents for all drivers</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
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
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by driver" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                {uniqueDrivers.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
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
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
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
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Document Type" /></SelectTrigger>
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

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver & Document</TableHead>
                <TableHead>Document Details</TableHead>
                <TableHead>Validity & Status</TableHead>
                <TableHead>Compliance & Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {doc.driverName}
                      </div>
                      <div className="text-sm text-muted-foreground">{doc.driverEmployeeId}</div>
                      <div className="text-sm font-medium">{doc.documentName}</div>
                      {getCategoryBadge(doc.category)}
                      <div className="text-xs text-muted-foreground">License: {doc.licenseNumber}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc.documentNumber || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">{doc.issuingAuthority}</div>
                      <div className="text-xs text-muted-foreground">
                        Type: {doc.documentType.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground">File: {doc.fileName}</div>
                      <div className="text-xs text-muted-foreground">
                        Size: {doc.fileSize} • {doc.fileType}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(doc.status)}
                      <div className="text-sm">Issued: {formatDate(doc.issueDate)}</div>
                      {doc.expiryDate && <div className="text-sm">Expires: {formatDate(doc.expiryDate)}</div>}
                      {doc.daysToExpiry !== undefined && (
                        <div className={`text-sm ${getDaysToExpiryColor(doc.daysToExpiry)}`}>
                          {doc.daysToExpiry < 0
                            ? `Overdue by ${Math.abs(doc.daysToExpiry)} days`
                            : `${doc.daysToExpiry} days left`}
                        </div>
                      )}
                      {doc.validityPeriod && (
                        <div className="text-xs text-muted-foreground">
                          Validity: {doc.validityPeriod} year(s)
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Progress value={doc.complianceScore} className="w-16 h-2" />
                        <span className="text-sm">{doc.complianceScore}%</span>
                      </div>
                      {getRiskBadge(doc.riskLevel)}
                      {doc.score && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Score: {doc.score}%
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">Reminders: {doc.remindersSent}</div>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(doc)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(doc)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(doc)}>
                          <RefreshCw className="h-4 w-4 mr-2" /> Renew Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVerify(doc)}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
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

      {/* Details + Edit Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={(open) => {
        setIsDetailsDialogOpen(open);
        if (!open) {
          setIsEditMode(false);
          setSelectedFile(null);
          setSelectedDocument(null);
        }
      }}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {selectedDocument?.documentName}
              {isEditMode && <span className="ml-2 text-sm text-blue-600">(Edit Mode)</span>}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Edit all document details below.' : 'View complete document information.'}
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6 py-4">
              {!isEditMode ? (
                /* View Mode */
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <Card><CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedDocument.complianceScore}%</div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getDaysToExpiryColor(selectedDocument.daysToExpiry)}`}>
                        {selectedDocument.daysToExpiry !== undefined
                          ? selectedDocument.daysToExpiry < 0
                            ? `${Math.abs(selectedDocument.daysToExpiry)} days overdue`
                            : `${selectedDocument.daysToExpiry} days left`
                          : 'No Expiry'}
                      </div>
                      <div className="text-sm text-muted-foreground">Expiry Status</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedDocument.renewalCost ? `${selectedDocument.renewalCost} ${selectedDocument.currency || ''}` : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Renewal Cost</div>
                    </CardContent></Card>
                  </div>
 {/* Driver Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Driver Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        Driver Name: {selectedDocument.driverName}
                      </div>
                      <div>Driver ID: {selectedDocument.driverId}</div>
                      <div>Employee ID: {selectedDocument.driverEmployeeId}</div>
                      <div>License Number: {selectedDocument.licenseNumber}</div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Document Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        Document Type:{" "}
                        {selectedDocument.documentType.replace(/_/g, " ")}
                      </div>
                      <div>
                        Document Number: {selectedDocument.documentNumber}
                      </div>
                      <div>Document Name: {selectedDocument.documentName}</div>
                      <div>Category: {selectedDocument.category}</div>
                      <div>Priority: {selectedDocument.priority}</div>
                      <div>
                        Status: {selectedDocument.status.replace(/_/g, " ")}
                      </div>
                      <div>Risk Level: {selectedDocument.riskLevel}</div>
                      <div>
                        Issuing Authority: {selectedDocument.issuingAuthority}
                      </div>
                    </div>
                  </div>

                  {/* Validity Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Validity Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        Issue Date: {formatDate(selectedDocument.issueDate)}
                      </div>
                      <div>
                        Expiry Date:{" "}
                        {formatDate(selectedDocument.expiryDate ?? "")}
                      </div>
                      <div>
                        Days to Expiry:{" "}
                        {selectedDocument.daysToExpiry !== undefined
                          ? selectedDocument.daysToExpiry < 0
                            ? `Overdue by ${Math.abs(
                                selectedDocument.daysToExpiry
                              )} days`
                            : `${selectedDocument.daysToExpiry} days`
                          : "No Expiry"}
                      </div>
                      <div>
                        Compliance Score: {selectedDocument.complianceScore}%
                      </div>
                    </div>
                  </div>

                  {/* File Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">File Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>File Name: {selectedDocument.fileName}</div>
                      <div>File Size: {selectedDocument.fileSize}</div>
                      <div>File Type: {selectedDocument.fileType}</div>
                      <div>
                        File URL:{" "}
                        <a
                          href={selectedDocument.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Upload & Verification */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Upload & Verification</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Uploaded By: {selectedDocument.uploadedBy}</div>
                      <div>
                        Uploaded At: {formatDate(selectedDocument.uploadedAt)}
                      </div>
                      <div>
                        Verified By:{" "}
                        {selectedDocument.verifiedBy || "Not Verified"}
                      </div>
                      <div>
                        Verified At:{" "}
                        {formatDate(selectedDocument.verifiedAt ?? "")}
                      </div>
                    </div>
                    {selectedDocument.verificationComments && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <span className="font-medium">
                          Verification Comments:
                        </span>{" "}
                        {selectedDocument.verificationComments}
                      </div>
                    )}
                  </div>

                  {/* Renewal Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Renewal Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        Renewal Cost:{" "}
                        {selectedDocument.renewalCost != null &&
                        selectedDocument.renewalCost > 0
                          ? `${selectedDocument.renewalCost} ${
                              selectedDocument.currency || ""
                            }`
                          : "N/A"}
                      </div>
                      <div>Currency: {selectedDocument.currency || "N/A"}</div>
                      <div>Vendor: {selectedDocument.vendor || "N/A"}</div>
                      <div>
                        Contact Number:{" "}
                        {selectedDocument.contactNumber || "N/A"}
                      </div>
                      <div>
                        Reminders Sent: {selectedDocument.remindersSent}
                      </div>
                      <div>
                        Last Reminder:{" "}
                        {formatDate(selectedDocument.lastReminderDate ?? "")}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedDocument.notes && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Notes</h4>
                      <div className="p-3 bg-muted rounded-lg text-sm">
                        {selectedDocument.notes}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {selectedDocument.attachments?.length ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        Attachments ({selectedDocument.attachments.length})
                      </h4>
                      <div className="space-y-1">
                        {selectedDocument.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="flex items-center text-sm text-blue-600"
                          >
                            <FileText className="h-3 w-3 mr-2" />
                            {att}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Audit Trail */}
                  {selectedDocument.auditTrail?.length ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">Audit Trail</h4>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {selectedDocument.auditTrail.map((entry, i) => (
                          <div
                            key={i}
                            className="border rounded-lg p-3 text-xs bg-muted"
                          >
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">
                                  {entry.action}
                                </div>
                                <div className="text-muted-foreground">
                                  By: {entry.performedBy}
                                </div>
                              </div>
                              <div className="text-muted-foreground">
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
                  ) : null}

                  {/* System Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">System Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Document ID: {selectedDocument.id}</div>
                      <div>
                        Created: {formatDate(selectedDocument.createdAt)}
                      </div>
                      <div>
                        Last Updated: {formatDate(selectedDocument.updatedAt)}
                      </div>
                    </div>
                  </div>

                </>
              ) : (
                /* Edit Mode */
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Document Name *</Label>
                      <Input name="documentName" value={editFormData.documentName} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-1">
                      <Label>Document Number *</Label>
                      <Input name="documentNumber" value={editFormData.documentNumber} onChange={handleFormChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Issue Date *</Label>
                      <Input type="date" name="issueDate" value={editFormData.issueDate} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-1">
                      <Label>Expiry Date</Label>
                      <Input type="date" name="expiryDate" value={editFormData.expiryDate} onChange={handleFormChange} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Issuing Authority *</Label>
                    <Input name="issuingAuthority" value={editFormData.issuingAuthority} onChange={handleFormChange} required />
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Renewal Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Renewal Cost</Label>
                        <Input type="number" name="renewalCost" value={editFormData.renewalCost} onChange={handleFormChange} />
                      </div>
                      <div className="space-y-1">
                        <Label>Currency</Label>
                        <Input name="currency" value={editFormData.currency} onChange={handleFormChange} />
                      </div>
                      <div className="space-y-1">
                        <Label>Vendor</Label>
                        <Input name="vendor" value={editFormData.vendor} onChange={handleFormChange} />
                      </div>
                      <div className="space-y-1">
                        <Label>Contact Number</Label>
                        <Input name="contactNumber" value={editFormData.contactNumber} onChange={handleFormChange} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Priority</Label>
                    <Select value={editFormData.priority} onValueChange={(v: "Low" | "Medium" | "High" | "Critical") => 
                      setEditFormData(p => ({...p, priority:v}))
                    }>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>File (optional)</Label>
                    <Input type="file" accept="application/pdf" onChange={handleFileChange} />
                    {selectedFile && <p className="text-sm text-green-600">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</p>}
                  </div>

                  <div className="space-y-1">
                    <Label>Notes</Label>
                    <Textarea name="notes" value={editFormData.notes} onChange={handleFormChange} rows={4} />
                  </div>
                </form>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {!isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
                <Button onClick={() => setIsEditMode(true)}><Edit className="h-4 w-4 mr-2" /> Edit Document</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancel</Button>
                <Button onClick={handleSubmit}><CheckCircle className="h-4 w-4 mr-2" /> Save Changes</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Driver Document</DialogTitle>
            <DialogDescription>Upload a new document for driver compliance and record keeping</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
          <form onSubmit={handleUploadSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select name="vehicle">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDrivers.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select name="documentType">
                  <SelectTrigger className='w-36'>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Medical_Certificate",
                      "Insurance_Policy",
                      "Pollution_Certificate",
                      "Fitness_Certificate",
                      "Route_Permit",
                      "Tax_Receipt",
                      "Service_Record",
                      "Inspection_Report",
                      "Ownership_Transfer",
                      "Hypothecation",
                      "No_Objection_Certificate",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input name="documentName" placeholder="Enter name" />
            </div>

            <div className="space-y-2">
              <Label>Document Number</Label>
              <Input name="documentNumber" placeholder="Enter number" />
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
              <Input name="issuingAuthority" placeholder="Enter authority" />
            </div>

            <div className="space-y-2">
              <Label>File Upload</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Input
                  id="uploadFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="uploadFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-6 w-6 mb-2 text-blue-500" />
                  <span className="text-sm">Click or drag file to upload</span>
                  <span className="text-xs text-gray-400 mt-1">
                    Only PDF files are allowed
                  </span>
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea name="notes" placeholder="Add notes..." rows={3} />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Upload Document</Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}