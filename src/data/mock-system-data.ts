import type { 
  GPSLog, 
  ExpiryAlert, 
  Notification, 
  AuditLog, 
  SystemSetting,
  VehicleDocument,
  DriverDocument
} from '../types/system-interfaces';

// Mock GPS Logs Data
export const mockGPSLogs: GPSLog[] = [
  {
    id: "gps-001",
    vehicleId: "veh-001",
    vehicleNumber: "DL-3C-AA-1234",
    driverId: "drv-001",
    driverName: "Rajesh Kumar",
    tripId: "asn-001",
    requestNumber: "TR-2024-001",
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      altitude: 220,
      accuracy: 5,
      timestamp: "2024-12-29T10:30:00Z",
      address: "Sector 62, Noida, Uttar Pradesh",
      speed: 45,
      heading: 135
    },
    status: "Active",
    ignitionStatus: "On",
    fuelLevel: 75,
    mileage: 45278,
    batteryLevel: 92,
    signalStrength: 85,
    lastPing: "2024-12-29T10:30:00Z",
    geofenceStatus: "Inside",
    speedAlerts: {
      currentSpeed: 45,
      speedLimit: 50,
      isViolation: false,
      violationCount: 0
    },
    panicButton: false,
    engineTemperature: 85,
    ac: true,
    doors: {
      frontLeft: false,
      frontRight: false,
      rearLeft: false,
      rearRight: false
    },
    deviceInfo: {
      deviceId: "GPS-001-DEV",
      imei: "865123045678901",
      firmwareVersion: "2.4.1",
      networkProvider: "Airtel"
    },
    createdAt: "2024-12-29T10:30:00Z",
    updatedAt: "2024-12-29T10:30:00Z"
  },
  {
    id: "gps-002",
    vehicleId: "veh-002",
    vehicleNumber: "HR-26-CX-9876",
    driverId: "drv-002",
    driverName: "Amit Singh",
    tripId: "asn-002",
    requestNumber: "TR-2024-002",
    location: {
      latitude: 28.4744,
      longitude: 77.4846,
      altitude: 210,
      accuracy: 8,
      timestamp: "2024-12-29T10:25:00Z",
      address: "India Expo Mart, Greater Noida",
      speed: 0,
      heading: 0
    },
    status: "Idle",
    ignitionStatus: "Off",
    fuelLevel: 68,
    mileage: 32189,
    batteryLevel: 78,
    signalStrength: 92,
    lastPing: "2024-12-29T10:25:00Z",
    geofenceStatus: "Inside",
    speedAlerts: {
      currentSpeed: 0,
      speedLimit: 40,
      isViolation: false,
      violationCount: 2
    },
    panicButton: false,
    engineTemperature: 45,
    ac: false,
    doors: {
      frontLeft: true,
      frontRight: false,
      rearLeft: false,
      rearRight: false
    },
    deviceInfo: {
      deviceId: "GPS-002-DEV",
      imei: "865123045678902",
      firmwareVersion: "2.4.1",
      networkProvider: "Jio"
    },
    createdAt: "2024-12-29T10:25:00Z",
    updatedAt: "2024-12-29T10:25:00Z"
  },
  {
    id: "gps-003",
    vehicleId: "veh-003",
    vehicleNumber: "MH-12-DE-3456",
    driverId: "drv-003",
    driverName: "Priya Sharma",
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      altitude: 15,
      accuracy: 12,
      timestamp: "2024-12-29T10:20:00Z",
      address: "Bandra Kurla Complex, Mumbai",
      speed: 65,
      heading: 270
    },
    status: "Active",
    ignitionStatus: "On",
    fuelLevel: 82,
    mileage: 28456,
    batteryLevel: 88,
    signalStrength: 76,
    lastPing: "2024-12-29T10:20:00Z",
    geofenceStatus: "Outside",
    speedAlerts: {
      currentSpeed: 65,
      speedLimit: 60,
      isViolation: true,
      violationCount: 1
    },
    panicButton: false,
    engineTemperature: 92,
    ac: true,
    doors: {
      frontLeft: false,
      frontRight: false,
      rearLeft: false,
      rearRight: false
    },
    deviceInfo: {
      deviceId: "GPS-003-DEV",
      imei: "865123045678903",
      firmwareVersion: "2.3.8",
      networkProvider: "Vi"
    },
    createdAt: "2024-12-29T10:20:00Z",
    updatedAt: "2024-12-29T10:20:00Z"
  },
  {
    id: "gps-004",
    vehicleId: "veh-004",
    vehicleNumber: "KA-03-HB-2468",
    driverId: "drv-004",
    driverName: "Suresh Reddy",
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      altitude: 920,
      accuracy: 6,
      timestamp: "2024-12-29T10:15:00Z",
      address: "Electronic City, Bangalore",
      speed: 0,
      heading: 0
    },
    status: "Offline",
    ignitionStatus: "Off",
    fuelLevel: 25,
    mileage: 67890,
    batteryLevel: 15,
    signalStrength: 0,
    lastPing: "2024-12-29T09:45:00Z",
    geofenceStatus: "Inside",
    speedAlerts: {
      currentSpeed: 0,
      speedLimit: 50,
      isViolation: false,
      violationCount: 5
    },
    panicButton: false,
    engineTemperature: 35,
    ac: false,
    doors: {
      frontLeft: false,
      frontRight: false,
      rearLeft: false,
      rearRight: false
    },
    deviceInfo: {
      deviceId: "GPS-004-DEV",
      imei: "865123045678904",
      firmwareVersion: "2.2.1",
      networkProvider: "BSNL"
    },
    createdAt: "2024-12-29T09:45:00Z",
    updatedAt: "2024-12-29T09:45:00Z"
  }
];

// Mock Expiry Alerts Data
export const mockExpiryAlerts: ExpiryAlert[] = [
  {
    id: "alert-001",
    alertType: "Vehicle_Insurance",
    entityType: "Vehicle",
    entityId: "veh-001",
    entityName: "DL-3C-AA-1234 (Honda City)",
    documentName: "Motor Vehicle Insurance",
    documentNumber: "POL-2024-VEH-001234",
    issueDate: "2024-06-15",
    expiryDate: "2025-06-15",
    daysToExpiry: 168,
    status: "Expiring_Soon",
    priority: "High",
    department: "Fleet Management",
    assignedTo: "fleet.manager@company.com",
    remindersSent: 2,
    lastReminderDate: "2024-12-20",
    renewalCost: 15000,
    currency: "LKR",
    vendor: "HDFC ERGO General Insurance",
    renewalProcess: {
      processStarted: true,
      documentsSubmitted: false,
      paymentMade: false
    },
    notes: "Comprehensive insurance with zero depreciation cover",
    attachments: ["insurance_policy_2024.pdf", "previous_claim_history.pdf"],
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-20T10:30:00Z"
  },
  {
    id: "alert-002",
    alertType: "Driver_License",
    entityType: "Driver",
    entityId: "drv-003",
    entityName: "Priya Sharma",
    documentName: "Commercial Driving License",
    documentNumber: "MH-DL-20240098765",
    issueDate: "2020-03-10",
    expiryDate: "2025-03-10",
    daysToExpiry: 71,
    status: "Expiring_Soon",
    priority: "Critical",
    department: "HR",
    assignedTo: "hr.admin@company.com",
    remindersSent: 3,
    lastReminderDate: "2024-12-25",
    renewalCost: 1200,
    currency: "LKR",
    vendor: "Maharashtra RTO",
    renewalProcess: {
      processStarted: false,
      documentsSubmitted: false,
      paymentMade: false
    },
    notes: "Driver needs to complete medical examination before renewal",
    attachments: ["license_copy.pdf", "medical_certificate.pdf"],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-25T14:20:00Z"
  },
  {
    id: "alert-003",
    alertType: "Pollution_Certificate",
    entityType: "Vehicle",
    entityId: "veh-002",
    entityName: "HR-26-CX-9876 (Mahindra XUV700)",
    documentName: "Pollution Under Control Certificate",
    documentNumber: "PUC-HR-2024-9876",
    issueDate: "2024-06-20",
    expiryDate: "2024-12-20",
    daysToExpiry: -9,
    status: "Expired",
    priority: "Critical",
    department: "Fleet Management",
    assignedTo: "fleet.admin@company.com",
    remindersSent: 5,
    lastReminderDate: "2024-12-18",
    renewalCost: 500,
    currency: "LKR",
    vendor: "Authorized PUC Center",
    renewalProcess: {
      processStarted: true,
      documentsSubmitted: true,
      paymentMade: true,
      newExpiryDate: "2025-06-20",
      renewalReference: "PUC-NEW-2024-001"
    },
    notes: "Vehicle tested and passed. New certificate issued.",
    attachments: ["new_puc_certificate.pdf", "emission_test_report.pdf"],
    createdAt: "2024-11-20T08:00:00Z",
    updatedAt: "2024-12-21T11:45:00Z",
    resolvedAt: "2024-12-21T11:45:00Z",
    resolvedBy: "fleet.admin@company.com"
  },
  {
    id: "alert-004",
    alertType: "Vehicle_Registration",
    entityType: "Vehicle",
    entityId: "veh-004",
    entityName: "KA-03-HB-2468 (Tata Nexon)",
    documentName: "Vehicle Registration Certificate",
    documentNumber: "KA-03-REG-2468-2020",
    issueDate: "2020-09-15",
    expiryDate: "2025-09-15",
    daysToExpiry: 260,
    status: "Active",
    priority: "Low",
    department: "Fleet Management",
    assignedTo: "fleet.manager@company.com",
    remindersSent: 0,
    renewalCost: 2500,
    currency: "LKR",
    vendor: "Karnataka RTO",
    renewalProcess: {
      processStarted: false,
      documentsSubmitted: false,
      paymentMade: false
    },
    notes: "15-year registration validity",
    attachments: ["registration_certificate.pdf"],
    createdAt: "2024-09-15T12:00:00Z",
    updatedAt: "2024-09-15T12:00:00Z"
  },
  {
    id: "alert-005",
    alertType: "Medical_Certificate",
    entityType: "Driver",
    entityId: "drv-001",
    entityName: "Rajesh Kumar",
    documentName: "Driver Medical Fitness Certificate",
    documentNumber: "MED-DL-2024-001",
    issueDate: "2024-01-15",
    expiryDate: "2025-01-15",
    daysToExpiry: 17,
    status: "Expiring_Soon",
    priority: "High",
    department: "HR",
    assignedTo: "hr.medical@company.com",
    remindersSent: 1,
    lastReminderDate: "2024-12-28",
    renewalCost: 800,
    currency: "LKR",
    vendor: "Approved Medical Center",
    renewalProcess: {
      processStarted: true,
      documentsSubmitted: false,
      paymentMade: false
    },
    notes: "Annual medical checkup required for commercial drivers",
    attachments: ["medical_report_2024.pdf"],
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-28T16:30:00Z"
  }
];

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Trip Request Approved",
    message: "Your trip request TR-2024-001 for airport transfer has been approved by David Wilson",
    type: "Success",
    category: "Trip",
    severity: "Medium",
    priority: "Normal",
    status: "Unread",
    recipientType: "User",
    recipients: [{
      userId: "emp-001",
      userName: "John Smith"
    }],
    sender: {
      userId: "mgr-001",
      userName: "David Wilson",
      system: false
    },
    relatedEntity: {
      type: "Trip",
      id: "req-001",
      name: "TR-2024-001"
    },
    actionable: true,
    actions: [{
      id: "view-trip",
      label: "View Trip Details",
      action: "navigate",
      parameters: { route: "/trips/TR-2024-001" }
    }],
    tags: ["trip", "approval", "airport"],
    readBy: [],
    createdAt: "2024-12-25T11:30:00Z",
    updatedAt: "2024-12-25T11:30:00Z"
  },
  {
    id: "notif-002",
    title: "Vehicle Insurance Expiring Soon",
    message: "Insurance for vehicle DL-3C-AA-1234 (Honda City) expires in 168 days. Please initiate renewal process.",
    type: "Warning",
    category: "Vehicle",
    severity: "High",
    priority: "High",
    status: "Read",
    recipientType: "Department",
    recipients: [{
      departmentId: "dept-fleet",
      departmentName: "Fleet Management"
    }],
    sender: {
      system: true
    },
    relatedEntity: {
      type: "Vehicle",
      id: "veh-001",
      name: "DL-3C-AA-1234"
    },
    actionable: true,
    actions: [
      {
        id: "view-insurance",
        label: "View Insurance Details",
        action: "navigate",
        parameters: { route: "/vehicles/veh-001/insurance" }
      },
      {
        id: "start-renewal",
        label: "Start Renewal Process",
        action: "api_call",
        parameters: { endpoint: "/api/insurance/renew", vehicleId: "veh-001" }
      }
    ],
    tags: ["insurance", "expiry", "vehicle", "renewal"],
    readBy: [{
      userId: "fleet-001",
      userName: "Fleet Manager",
      readAt: "2024-12-26T09:15:00Z"
    }],
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-26T09:15:00Z"
  },
  {
    id: "notif-003",
    title: "Emergency Alert: Panic Button Pressed",
    message: "EMERGENCY: Panic button pressed in vehicle HR-26-CX-9876 driven by Amit Singh. Location: India Expo Mart, Greater Noida",
    type: "Error",
    category: "Emergency",
    severity: "Critical",
    priority: "Urgent",
    status: "Acknowledged",
    recipientType: "Broadcast",
    recipients: [
      {
        roleId: "role-fleet-manager",
        roleName: "Fleet Manager"
      },
      {
        roleId: "role-security",
        roleName: "Security Team"
      }
    ],
    sender: {
      system: true
    },
    relatedEntity: {
      type: "Vehicle",
      id: "veh-002",
      name: "HR-26-CX-9876"
    },
    actionable: true,
    actions: [
      {
        id: "track-vehicle",
        label: "Track Vehicle Live",
        action: "navigate",
        parameters: { route: "/tracking/veh-002" }
      },
      {
        id: "contact-driver",
        label: "Contact Driver",
        action: "call",
        parameters: { phone: "+91-9123456789" }
      },
      {
        id: "dispatch-help",
        label: "Dispatch Emergency Help",
        action: "api_call",
        parameters: { endpoint: "/api/emergency/dispatch" }
      }
    ],
    scheduledFor: "2024-12-28T14:30:00Z",
    tags: ["emergency", "panic", "security", "immediate"],
    readBy: [
      {
        userId: "fleet-001",
        userName: "Fleet Manager",
        readAt: "2024-12-28T14:31:00Z"
      },
      {
        userId: "security-001",
        userName: "Security Officer",
        readAt: "2024-12-28T14:32:00Z"
      }
    ],
    acknowledgedBy: {
      userId: "security-001",
      userName: "Security Officer",
      acknowledgedAt: "2024-12-28T14:35:00Z",
      comments: "Emergency response team dispatched. ETA 15 minutes."
    },
    createdAt: "2024-12-28T14:30:00Z",
    updatedAt: "2024-12-28T14:35:00Z"
  },
  {
    id: "notif-004",
    title: "Speed Limit Violation",
    message: "Vehicle MH-12-DE-3456 driven by Priya Sharma exceeded speed limit (65 km/h in 60 km/h zone) at BKC, Mumbai",
    type: "Warning",
    category: "Driver",
    severity: "Medium",
    priority: "Normal",
    status: "Read",
    recipientType: "User",
    recipients: [{
      userId: "drv-003",
      userName: "Priya Sharma"
    }],
    sender: {
      system: true
    },
    relatedEntity: {
      type: "Vehicle",
      id: "veh-003",
      name: "MH-12-DE-3456"
    },
    actionable: false,
    tags: ["speed", "violation", "driving", "safety"],
    readBy: [{
      userId: "drv-003",
      userName: "Priya Sharma",
      readAt: "2024-12-29T10:25:00Z"
    }],
    createdAt: "2024-12-29T10:20:00Z",
    updatedAt: "2024-12-29T10:25:00Z"
  },
  {
    id: "notif-005",
    title: "Monthly Trip Report Generated",
    message: "December 2024 trip report has been generated and is ready for review. Total trips: 145, Total cost: ₹2,84,500",
    type: "Info",
    category: "System",
    severity: "Low",
    priority: "Normal",
    status: "Unread",
    recipientType: "Role",
    recipients: [{
      roleId: "role-finance-manager",
      roleName: "Finance Manager"
    }],
    sender: {
      system: true
    },
    actionable: true,
    actions: [{
      id: "download-report",
      label: "Download Report",
      action: "download",
      parameters: { reportId: "RPT-2024-12", format: "pdf" }
    }],
    expiresAt: "2025-01-15T23:59:59Z",
    tags: ["report", "monthly", "finance", "trips"],
    readBy: [],
    createdAt: "2024-12-29T08:00:00Z",
    updatedAt: "2024-12-29T08:00:00Z"
  }
];

// Mock Audit Logs Data
export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-001",
    timestamp: "2024-12-29T10:30:00Z",
    userId: "emp-001",
    userName: "John Smith",
    userRole: "Employee",
    action: "Created trip request TR-2024-003",
    actionType: "Create",
    module: "Trips",
    entityType: "Trip",
    entityId: "req-003",
    entityName: "TR-2024-003",
    description: "New trip request created for client visit to Pune",
    changes: [
      {
        field: "destination",
        oldValue: null,
        newValue: "Client Office, Pune"
      },
      {
        field: "departureDate",
        oldValue: null,
        newValue: "2024-12-30"
      },
      {
        field: "estimatedCost",
        oldValue: null,
        newValue: 3500
      }
    ],
    metadata: {
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      browser: "Chrome 120.0.0.0",
      operatingSystem: "Windows 10",
      device: "Desktop",
      location: {
        country: "India",
        city: "Noida",
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090,
          accuracy: 50,
          timestamp: "2024-12-29T10:30:00Z"
        }
      },
      sessionId: "sess-2024-001-john",
      requestId: "req-api-12345"
    },
    severity: "Info",
    status: "Success",
    duration: 1250,
    tags: ["trip", "create", "employee"],
    archived: false,
    retentionDate: "2025-12-29T10:30:00Z",
    createdAt: "2024-12-29T10:30:00Z"
  },
  {
    id: "audit-002",
    timestamp: "2024-12-29T09:45:00Z",
    userId: "mgr-001",
    userName: "David Wilson",
    userRole: "Manager",
    action: "Approved trip request TR-2024-001",
    actionType: "Approve",
    module: "Trips",
    entityType: "Trip",
    entityId: "req-001",
    entityName: "TR-2024-001",
    description: "Trip request approved with manager comments",
    changes: [
      {
        field: "status",
        oldValue: "Pending Approval",
        newValue: "Approved"
      },
      {
        field: "approvedBy",
        oldValue: null,
        newValue: "David Wilson"
      },
      {
        field: "approvalComments",
        oldValue: null,
        newValue: "Approved for client meeting"
      }
    ],
    metadata: {
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      browser: "Chrome 120.0.0.0",
      operatingSystem: "macOS 10.15.7",
      device: "Desktop",
      location: {
        country: "India",
        city: "Delhi"
      },
      sessionId: "sess-2024-002-david",
      requestId: "req-api-12346"
    },
    severity: "Info",
    status: "Success",
    duration: 850,
    tags: ["trip", "approval", "manager"],
    archived: false,
    retentionDate: "2025-12-29T09:45:00Z",
    createdAt: "2024-12-29T09:45:00Z"
  },
  {
    id: "audit-003",
    timestamp: "2024-12-29T08:15:00Z",
    userId: "admin-001",
    userName: "System Administrator",
    userRole: "Administrator",
    action: "Failed login attempt",
    actionType: "Login",
    module: "Authentication",
    description: "Multiple failed login attempts detected for user account",
    metadata: {
      ipAddress: "103.25.67.89",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      browser: "Chrome 120.0.0.0",
      operatingSystem: "Linux",
      device: "Desktop",
      location: {
        country: "India",
        city: "Mumbai"
      },
      sessionId: "sess-failed-001",
      requestId: "req-api-12347"
    },
    severity: "Warning",
    status: "Failed",
    duration: 3000,
    errorMessage: "Invalid credentials provided. Account temporarily locked after 5 failed attempts.",
    tags: ["authentication", "security", "failed-login"],
    archived: false,
    retentionDate: "2025-12-29T08:15:00Z",
    createdAt: "2024-12-29T08:15:00Z"
  },
  {
    id: "audit-004",
    timestamp: "2024-12-28T16:20:00Z",
    userId: "fleet-001",
    userName: "Fleet Manager",
    userRole: "Fleet Manager",
    action: "Updated vehicle maintenance schedule",
    actionType: "Update",
    module: "Vehicles",
    entityType: "Vehicle",
    entityId: "veh-001",
    entityName: "DL-3C-AA-1234",
    description: "Vehicle maintenance schedule updated with next service date",
    changes: [
      {
        field: "nextServiceDate",
        oldValue: "2024-12-15",
        newValue: "2025-03-15"
      },
      {
        field: "lastServiceMileage",
        oldValue: 44850,
        newValue: 45230
      },
      {
        field: "maintenanceStatus",
        oldValue: "Due",
        newValue: "Completed"
      }
    ],
    metadata: {
      ipAddress: "192.168.1.110",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
      browser: "Firefox 120.0",
      operatingSystem: "Windows 10",
      device: "Desktop",
      location: {
        country: "India",
        city: "Gurgaon"
      },
      sessionId: "sess-2024-003-fleet",
      requestId: "req-api-12348"
    },
    severity: "Info",
    status: "Success",
    duration: 2100,
    tags: ["vehicle", "maintenance", "update"],
    archived: false,
    retentionDate: "2025-12-28T16:20:00Z",
    createdAt: "2024-12-28T16:20:00Z"
  },
  {
    id: "audit-005",
    timestamp: "2024-12-28T11:30:00Z",
    userId: "hr-001",
    userName: "HR Administrator",
    userRole: "HR Admin",
    action: "Exported driver performance report",
    actionType: "Export",
    module: "Reports",
    description: "Generated and exported monthly driver performance report for December 2024",
    metadata: {
      ipAddress: "192.168.1.115",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
      browser: "Edge 120.0.0.0",
      operatingSystem: "Windows 10",
      device: "Desktop",
      location: {
        country: "India",
        city: "Bangalore"
      },
      sessionId: "sess-2024-004-hr",
      requestId: "req-api-12349"
    },
    severity: "Info",
    status: "Success",
    duration: 5400,
    tags: ["report", "export", "driver", "performance"],
    archived: false,
    retentionDate: "2025-12-28T11:30:00Z",
    createdAt: "2024-12-28T11:30:00Z"
  }
];

// Mock System Settings Data
export const mockSystemSettings: SystemSetting[] = [
  {
    id: "setting-001",
    category: "General",
    key: "company_name",
    name: "Company Name",
    description: "Official name of the organization",
    value: "TechCorp Fleet Solutions",
    dataType: "String",
    defaultValue: "My Company",
    validationRules: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    scope: "Global",
    visibility: "Public",
    editable: true,
    encrypted: false,
    lastModifiedBy: "admin@company.com",
    lastModifiedAt: "2024-12-01T10:00:00Z",
    version: 1,
    environment: "Production",
    tags: ["company", "branding"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "setting-002",
    category: "GPS",
    key: "gps_tracking_interval",
    name: "GPS Tracking Interval",
    description: "How frequently GPS location should be updated (in seconds)",
    value: 30,
    dataType: "Number",
    defaultValue: 60,
    validationRules: {
      required: true,
      minValue: 10,
      maxValue: 300
    },
    scope: "Global",
    visibility: "Admin",
    editable: true,
    encrypted: false,
    lastModifiedBy: "fleet.admin@company.com",
    lastModifiedAt: "2024-12-15T14:30:00Z",
    version: 3,
    environment: "Production",
    tags: ["gps", "tracking", "performance"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-15T14:30:00Z"
  },
  {
    id: "setting-003",
    category: "Security",
    key: "max_login_attempts",
    name: "Maximum Login Attempts",
    description: "Maximum number of failed login attempts before account lockout",
    value: 5,
    dataType: "Number",
    defaultValue: 3,
    validationRules: {
      required: true,
      minValue: 3,
      maxValue: 10
    },
    scope: "Global",
    visibility: "Admin",
    editable: true,
    encrypted: false,
    lastModifiedBy: "security.admin@company.com",
    lastModifiedAt: "2024-11-20T09:15:00Z",
    version: 2,
    environment: "Production",
    tags: ["security", "authentication", "lockout"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-20T09:15:00Z"
  },
  {
    id: "setting-004",
    category: "Notifications",
    key: "email_notifications_enabled",
    name: "Email Notifications",
    description: "Enable or disable email notifications system-wide",
    value: true,
    dataType: "Boolean",
    defaultValue: true,
    scope: "Global",
    visibility: "Admin",
    editable: true,
    encrypted: false,
    lastModifiedBy: "admin@company.com",
    lastModifiedAt: "2024-10-01T12:00:00Z",
    version: 1,
    environment: "Production",
    tags: ["notifications", "email"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-10-01T12:00:00Z"
  },
  {
    id: "setting-005",
    category: "Fleet",
    key: "default_speed_limit",
    name: "Default Speed Limit",
    description: "Default speed limit for vehicles (km/h)",
    value: 60,
    dataType: "Number",
    defaultValue: 50,
    validationRules: {
      required: true,
      minValue: 20,
      maxValue: 120
    },
    scope: "Global",
    visibility: "Admin",
    editable: true,
    encrypted: false,
    lastModifiedBy: "fleet.manager@company.com",
    lastModifiedAt: "2024-12-10T16:45:00Z",
    version: 4,
    environment: "Production",
    tags: ["fleet", "speed", "safety"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-10T16:45:00Z"
  },
  {
    id: "setting-006",
    category: "Billing",
    key: "currency_code",
    name: "Default Currency",
    description: "Default currency for all financial transactions",
    value: "LKR",
    dataType: "String",
    defaultValue: "USD",
    validationRules: {
      required: true,
      enum: ["USD", "EUR", "LKR", "GBP", "AUD", "CAD"]
    },
    scope: "Global",
    visibility: "Public",
    editable: true,
    encrypted: false,
    lastModifiedBy: "finance.admin@company.com",
    lastModifiedAt: "2024-08-15T11:20:00Z",
    version: 1,
    environment: "Production",
    tags: ["billing", "currency", "finance"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-08-15T11:20:00Z"
  },
  {
    id: "setting-007",
    category: "Integration",
    key: "api_rate_limit",
    name: "API Rate Limit",
    description: "Maximum API requests per minute per user",
    value: 1000,
    dataType: "Number",
    defaultValue: 500,
    validationRules: {
      required: true,
      minValue: 100,
      maxValue: 5000
    },
    scope: "Global",
    visibility: "System",
    editable: true,
    encrypted: false,
    lastModifiedBy: "api.admin@company.com",
    lastModifiedAt: "2024-12-20T10:30:00Z",
    version: 2,
    environment: "Production",
    tags: ["api", "performance", "rate-limit"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-20T10:30:00Z"
  },
  {
    id: "setting-008",
    category: "Backup",
    key: "auto_backup_enabled",
    name: "Automatic Backup",
    description: "Enable automatic daily backup of system data",
    value: true,
    dataType: "Boolean",
    defaultValue: false,
    scope: "Global",
    visibility: "System",
    editable: true,
    encrypted: false,
    lastModifiedBy: "backup.admin@company.com",
    lastModifiedAt: "2024-09-01T08:00:00Z",
    version: 1,
    environment: "Production",
    tags: ["backup", "data", "protection"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-09-01T08:00:00Z"
  }
];

// Mock Vehicle Documents Data
export const mockVehicleDocuments: VehicleDocument[] = [
  {
    id: "vdoc-001",
    vehicleId: "veh-001",
    vehicleNumber: "DL-3C-AA-1234",
    vehicleMake: "Honda",
    vehicleModel: "City",
    documentType: "Registration_Certificate",
    documentName: "Vehicle Registration Certificate",
    documentNumber: "DL-RC-2020-001234",
    issuingAuthority: "Delhi Transport Department",
    issueDate: "2020-06-15",
    expiryDate: "2035-06-15",
    status: "Valid",
    priority: "Medium",
    category: "Legal",
    fileUrl: "/documents/vehicles/reg-cert-dl-001234.pdf",
    fileName: "Registration_Certificate_DL3CAA1234.pdf",
    fileSize: "2.3 MB",
    fileType: "PDF",
    uploadedBy: "fleet.admin@company.com",
    uploadedAt: "2024-01-15T09:00:00Z",
    verifiedBy: "legal.team@company.com",
    verifiedAt: "2024-01-16T14:30:00Z",
    verificationComments: "Document verified and valid. All details match vehicle records.",
    renewalCost: 2500,
    currency: "LKR",
    vendor: "Delhi Transport Department",
    contactNumber: "+91-11-23456789",
    notes: "15-year validity from date of registration",
    remindersSent: 0,
    daysToExpiry: 3850,
    complianceScore: 95,
    riskLevel: "Low",
    attachments: ["registration_certificate.pdf", "form_20.pdf"],
    auditTrail: [
      {
        action: "Document uploaded",
        performedBy: "fleet.admin@company.com",
        timestamp: "2024-01-15T09:00:00Z"
      },
      {
        action: "Document verified",
        performedBy: "legal.team@company.com",
        timestamp: "2024-01-16T14:30:00Z",
        comments: "Verification completed successfully"
      }
    ],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z"
  },
  {
    id: "vdoc-002",
    vehicleId: "veh-001",
    vehicleNumber: "DL-3C-AA-1234",
    vehicleMake: "Honda",
    vehicleModel: "City",
    documentType: "Insurance_Policy",
    documentName: "Motor Vehicle Insurance Policy",
    documentNumber: "HDFC-POL-2024-001234",
    issuingAuthority: "HDFC ERGO General Insurance",
    issueDate: "2024-06-15",
    expiryDate: "2025-06-15",
    status: "Expiring_Soon",
    priority: "High",
    category: "Insurance",
    fileUrl: "/documents/vehicles/insurance-pol-001234.pdf",
    fileName: "Insurance_Policy_DL3CAA1234_2024.pdf",
    fileSize: "1.8 MB",
    fileType: "PDF",
    uploadedBy: "insurance.admin@company.com",
    uploadedAt: "2024-06-16T10:00:00Z",
    verifiedBy: "finance.team@company.com",
    verifiedAt: "2024-06-16T15:45:00Z",
    verificationComments: "Comprehensive insurance with zero depreciation. All endorsements verified.",
    renewalCost: 15000,
    currency: "LKR",
    vendor: "HDFC ERGO General Insurance",
    contactNumber: "+91-1800-266-0101",
    notes: "Comprehensive coverage with zero depreciation and engine protection",
    remindersSent: 2,
    lastReminderDate: "2024-12-20T10:00:00Z",
    daysToExpiry: 168,
    complianceScore: 88,
    riskLevel: "Medium",
    attachments: ["insurance_policy.pdf", "premium_receipt.pdf", "no_claim_bonus.pdf"],
    auditTrail: [
      {
        action: "Document uploaded",
        performedBy: "insurance.admin@company.com",
        timestamp: "2024-06-16T10:00:00Z"
      },
      {
        action: "Document verified",
        performedBy: "finance.team@company.com",
        timestamp: "2024-06-16T15:45:00Z",
        comments: "Insurance policy verified and premium paid"
      },
      {
        action: "Renewal reminder sent",
        performedBy: "system",
        timestamp: "2024-12-20T10:00:00Z",
        comments: "First renewal reminder sent to insurance team"
      }
    ],
    createdAt: "2024-06-16T10:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z"
  },
  {
    id: "vdoc-003",
    vehicleId: "veh-002",
    vehicleNumber: "HR-26-CX-9876",
    vehicleMake: "Mahindra",
    vehicleModel: "XUV700",
    documentType: "Pollution_Certificate",
    documentName: "Pollution Under Control Certificate",
    documentNumber: "PUC-HR-2024-9876",
    issuingAuthority: "Authorized PUC Center, Gurgaon",
    issueDate: "2024-06-20",
    expiryDate: "2024-12-20",
    status: "Expired",
    priority: "Critical",
    category: "Compliance",
    fileUrl: "/documents/vehicles/puc-cert-9876.pdf",
    fileName: "PUC_Certificate_HR26CX9876.pdf",
    fileSize: "0.8 MB",
    fileType: "PDF",
    uploadedBy: "fleet.admin@company.com",
    uploadedAt: "2024-06-21T11:00:00Z",
    verifiedBy: "compliance.officer@company.com",
    verifiedAt: "2024-06-21T16:20:00Z",
    verificationComments: "PUC test passed. Emission levels within permissible limits.",
    renewalCost: 500,
    currency: "LKR",
    vendor: "Green Check PUC Center",
    contactNumber: "+91-9876543210",
    notes: "6-month validity for diesel vehicles",
    remindersSent: 5,
    lastReminderDate: "2024-12-18T09:00:00Z",
    daysToExpiry: -9,
    complianceScore: 25,
    riskLevel: "Critical",
    attachments: ["puc_certificate.pdf", "emission_test_report.pdf"],
    auditTrail: [
      {
        action: "Document uploaded",
        performedBy: "fleet.admin@company.com",
        timestamp: "2024-06-21T11:00:00Z"
      },
      {
        action: "Document verified",
        performedBy: "compliance.officer@company.com",
        timestamp: "2024-06-21T16:20:00Z",
        comments: "PUC test passed within limits"
      },
      {
        action: "Document expired",
        performedBy: "system",
        timestamp: "2024-12-20T00:00:00Z",
        comments: "PUC certificate has expired. Vehicle compliance at risk."
      }
    ],
    createdAt: "2024-06-21T11:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z"
  },
  {
    id: "vdoc-004",
    vehicleId: "veh-003",
    vehicleNumber: "MH-12-DE-3456",
    vehicleMake: "Toyota",
    vehicleModel: "Innova Crysta",
    documentType: "Fitness_Certificate",
    documentName: "Vehicle Fitness Certificate",
    documentNumber: "MH-FC-2024-3456",
    issuingAuthority: "Maharashtra RTO, Mumbai",
    issueDate: "2024-01-10",
    expiryDate: "2025-01-10",
    status: "Valid",
    priority: "Medium",
    category: "Legal",
    fileUrl: "/documents/vehicles/fitness-cert-3456.pdf",
    fileName: "Fitness_Certificate_MH12DE3456.pdf",
    fileSize: "1.2 MB",
    fileType: "PDF",
    uploadedBy: "rto.liaison@company.com",
    uploadedAt: "2024-01-12T14:00:00Z",
    verifiedBy: "fleet.manager@company.com",
    verifiedAt: "2024-01-12T17:30:00Z",
    verificationComments: "Vehicle fitness test passed. All safety parameters within limits.",
    renewalCost: 1200,
    currency: "LKR",
    vendor: "Maharashtra RTO",
    contactNumber: "+91-22-12345678",
    notes: "Annual fitness certificate for commercial vehicles",
    remindersSent: 0,
    daysToExpiry: 12,
    complianceScore: 92,
    riskLevel: "Low",
    attachments: ["fitness_certificate.pdf", "test_report.pdf"],
    auditTrail: [
      {
        action: "Document uploaded",
        performedBy: "rto.liaison@company.com",
        timestamp: "2024-01-12T14:00:00Z"
      },
      {
        action: "Document verified",
        performedBy: "fleet.manager@company.com",
        timestamp: "2024-01-12T17:30:00Z",
        comments: "Fitness certificate verified and valid"
      }
    ],
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-12T17:30:00Z"
  },
  {
    id: "vdoc-005",
    vehicleId: "veh-004",
    vehicleNumber: "KA-03-HB-2468",
    vehicleMake: "Tata",
    vehicleModel: "Nexon",
    documentType: "Service_Record",
    documentName: "Vehicle Service and Maintenance Record",
    documentNumber: "SVC-KA-2024-2468",
    issuingAuthority: "Tata Motors Authorized Service Center",
    issueDate: "2024-12-15",
    status: "Valid",
    priority: "Low",
    category: "Maintenance",
    fileUrl: "/documents/vehicles/service-record-2468.pdf",
    fileName: "Service_Record_KA03HB2468_Dec2024.pdf",
    fileSize: "3.5 MB",
    fileType: "PDF",
    uploadedBy: "maintenance.team@company.com",
    uploadedAt: "2024-12-16T09:30:00Z",
    verifiedBy: "fleet.manager@company.com",
    verifiedAt: "2024-12-16T11:15:00Z",
    verificationComments: "Regular service completed. All systems checked and working properly.",
    renewalCost: 8500,
    currency: "LKR",
    vendor: "Tata Motors Service Center",
    contactNumber: "+91-80-98765432",
    notes: "Major service completed including oil change, filter replacement, and brake inspection",
    remindersSent: 0,
    complianceScore: 98,
    riskLevel: "Low",
    attachments: ["service_invoice.pdf", "parts_replaced.pdf", "next_service_schedule.pdf"],
    auditTrail: [
      {
        action: "Document uploaded",
        performedBy: "maintenance.team@company.com",
        timestamp: "2024-12-16T09:30:00Z"
      },
      {
        action: "Service record verified",
        performedBy: "fleet.manager@company.com",
        timestamp: "2024-12-16T11:15:00Z",
        comments: "Service completed as per schedule"
      }
    ],
    createdAt: "2024-12-16T09:30:00Z",
    updatedAt: "2024-12-16T11:15:00Z"
  },
  
];

// Mock Driver Documents Data
export const mockDriverDocuments: DriverDocument[] = [
  {
    id: "ddoc-001",
    driverId: "drv-001",
    driverName: "Rajesh Kumar",
    driverEmployeeId: "EMP-DRV-001",
    licenseNumber: "DL-0120230001234",
    documentType: "Driving_License",
    documentName: "Commercial Driving License",
    documentNumber: "DL-0120230001234",
    issuingAuthority: "Delhi Transport Department",
    issueDate: "2020-03-15",
    expiryDate: "2025-03-15",
    status: "Valid",
    priority: "High",
    category: "Legal",
    fileUrl: "/documents/drivers/license-001234.pdf",
    fileName: "Driving_License_Rajesh_Kumar.pdf",
    fileSize: "1.1 MB",
    fileType: "PDF",
    uploadedBy: "hr.admin@company.com",
    uploadedAt: "2024-01-10T10:00:00Z",
    verifiedBy: "hr.manager@company.com",
    verifiedAt: "2024-01-10T15:20:00Z",
    verificationComments: "Commercial driving license verified. All endorsements valid.",
    renewalCost: 1200,
    currency: "LKR",
    vendor: "Delhi Transport Department",
    contactNumber: "+91-11-23456789",
    certificationLevel: "Heavy Vehicle License",
    score: 95,
    validityPeriod: 5,
    notes: "Clean driving record with no violations",
    remindersSent: 0,
    daysToExpiry: 75,
    complianceScore: 98,
    riskLevel: "Low",
    attachments: ["license_front.pdf", "license_back.pdf", "endorsements.pdf"],
    auditTrail: [
      {
        action: "Document uploaded",
        performedBy: "hr.admin@company.com",
        timestamp: "2024-01-10T10:00:00Z"
      },
      {
        action: "License verified",
        performedBy: "hr.manager@company.com",
        timestamp: "2024-01-10T15:20:00Z",
        comments: "License valid and verified"
      }
    ],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T15:20:00Z"
  },
  {
    id: "ddoc-002",
    driverId: "drv-001",
    driverName: "Rajesh Kumar",
    driverEmployeeId: "EMP-DRV-001",
    licenseNumber: "DL-0120230001234",
    documentType: "Medical_Certificate",
    documentName: "Driver Medical Fitness Certificate",
    documentNumber: "MED-DL-2024-001",
    issuingAuthority: "Approved Medical Center, Delhi",
    issueDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "Expiring_Soon",
    priority: "High",
    category: "Medical",
    fileUrl: "/documents/drivers/medical-001.pdf",
    fileName: "Medical_Certificate_Rajesh_Kumar_2024.pdf",
    fileSize: "0.9 MB",
    fileType: "PDF",
    uploadedBy: "hr.medical@company.com",
    uploadedAt: "2024-01-16T11:00:00Z",
    verifiedBy: "company.doctor@company.com",
    verifiedAt: "2024-01-16T14:30:00Z",
    verificationComments: "Medical examination passed. Driver fit for commercial driving.",
    renewalCost: 800,
    currency: "LKR",
    vendor: "Delhi Medical Center",
    contactNumber: "+91-9876543210",
    medicalCenter: "Delhi Medical Center, Connaught Place",
    score: 92,
    validityPeriod: 1,
    notes: "Annual medical checkup required for commercial drivers above 40 years",
    remindersSent: 1,
    lastReminderDate: "2024-12-28T09:00:00Z",
    daysToExpiry: 17,
    complianceScore: 85,
    riskLevel: "Medium",
    attachments: ["medical_report.pdf", "vision_test.pdf", "blood_test.pdf"],
    auditTrail: [
      {
        action: "Medical examination scheduled",
        performedBy: "hr.medical@company.com",
        timestamp: "2024-01-10T09:00:00Z"
      },
      {
        action: "Medical certificate uploaded",
        performedBy: "hr.medical@company.com",
        timestamp: "2024-01-16T11:00:00Z"
      },
      {
        action: "Medical certificate verified",
        performedBy: "company.doctor@company.com",
        timestamp: "2024-01-16T14:30:00Z",
        comments: "Driver medically fit for duty"
      }
    ],
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-12-28T09:00:00Z"
  },
  {
    id: "ddoc-003",
    driverId: "drv-002",
    driverName: "Amit Singh",
    driverEmployeeId: "EMP-DRV-002",
    licenseNumber: "HR-0520220002345",
    documentType: "Police_Verification",
    documentName: "Police Verification Certificate",
    documentNumber: "PV-HR-2024-002345",
    issuingAuthority: "Haryana Police Department",
    issueDate: "2024-02-20",
    expiryDate: "2027-02-20",
    status: "Valid",
    priority: "Medium",
    category: "Verification",
    fileUrl: "/documents/drivers/police-verification-002345.pdf",
    fileName: "Police_Verification_Amit_Singh.pdf",
    fileSize: "1.3 MB",
    fileType: "PDF",
    uploadedBy: "security.team@company.com",
    uploadedAt: "2024-02-25T10:30:00Z",
    verifiedBy: "security.head@company.com",
    verifiedAt: "2024-02-25T16:45:00Z",
    verificationComments: "Background verification completed. No criminal record found.",
    renewalCost: 500,
    currency: "LKR",
    vendor: "Haryana Police Department",
    contactNumber: "+91-0124-2345678",
    score: 100,
    validityPeriod: 3,
    notes: "Clean background check with no criminal history",
    remindersSent: 0,
    daysToExpiry: 785,
    complianceScore: 100,
    riskLevel: "Low",
    attachments: ["police_verification.pdf", "character_certificate.pdf"],
    auditTrail: [
      {
        action: "Verification request submitted",
        performedBy: "security.team@company.com",
        timestamp: "2024-02-01T09:00:00Z"
      },
      {
        action: "Verification certificate received",
        performedBy: "security.team@company.com",
        timestamp: "2024-02-25T10:30:00Z"
      },
      {
        action: "Verification completed",
        performedBy: "security.head@company.com",
        timestamp: "2024-02-25T16:45:00Z",
        comments: "Background check cleared"
      }
    ],
    createdAt: "2024-02-25T10:30:00Z",
    updatedAt: "2024-02-25T16:45:00Z"
  },
  {
    id: "ddoc-004",
    driverId: "drv-003",
    driverName: "Priya Sharma",
    driverEmployeeId: "EMP-DRV-003",
    licenseNumber: "MH-1220210003456",
    documentType: "Training_Certificate",
    documentName: "Defensive Driving Training Certificate",
    documentNumber: "TRN-MH-2024-003456",
    issuingAuthority: "Maharashtra Institute of Driving Training",
    issueDate: "2024-03-10",
    expiryDate: "2027-03-10",
    status: "Valid",
    priority: "Medium",
    category: "Training",
    fileUrl: "/documents/drivers/training-003456.pdf",
    fileName: "Training_Certificate_Priya_Sharma.pdf",
    fileSize: "1.5 MB",
    fileType: "PDF",
    uploadedBy: "training.coordinator@company.com",
    uploadedAt: "2024-03-15T12:00:00Z",
    verifiedBy: "fleet.manager@company.com",
    verifiedAt: "2024-03-15T17:30:00Z",
    verificationComments: "Defensive driving training completed successfully. Excellent performance.",
    renewalCost: 2500,
    currency: "LKR",
    vendor: "Maharashtra Institute of Driving Training",
    contactNumber: "+91-22-87654321",
    trainingInstitute: "Maharashtra Institute of Driving Training, Mumbai",
    certificationLevel: "Advanced Defensive Driving",
    score: 96,
    validityPeriod: 3,
    notes: "Specialized training in defensive driving techniques and emergency response",
    remindersSent: 0,
    daysToExpiry: 805,
    complianceScore: 96,
    riskLevel: "Low",
    attachments: ["training_certificate.pdf", "practical_test_report.pdf", "theory_exam_results.pdf"],
    auditTrail: [
      {
        action: "Training enrollment",
        performedBy: "training.coordinator@company.com",
        timestamp: "2024-02-15T10:00:00Z"
      },
      {
        action: "Training completed",
        performedBy: "training.coordinator@company.com",
        timestamp: "2024-03-10T16:00:00Z"
      },
      {
        action: "Certificate uploaded",
        performedBy: "training.coordinator@company.com",
        timestamp: "2024-03-15T12:00:00Z"
      },
      {
        action: "Certificate verified",
        performedBy: "fleet.manager@company.com",
        timestamp: "2024-03-15T17:30:00Z",
        comments: "Training completed with excellent scores"
      }
    ],
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T17:30:00Z"
  },
  {
    id: "ddoc-005",
    driverId: "drv-004",
    driverName: "Suresh Reddy",
    driverEmployeeId: "EMP-DRV-004",
    licenseNumber: "KA-0320190004567",
    documentType: "Insurance_Policy",
    documentName: "Driver Personal Accident Insurance",
    documentNumber: "PAI-KA-2024-004567",
    issuingAuthority: "National Insurance Company Ltd",
    issueDate: "2024-04-01",
    expiryDate: "2025-04-01",
    status: "Valid",
    priority: "Medium",
    category: "Insurance",
    fileUrl: "/documents/drivers/insurance-004567.pdf",
    fileName: "Driver_Insurance_Suresh_Reddy.pdf",
    fileSize: "2.1 MB",
    fileType: "PDF",
    uploadedBy: "insurance.admin@company.com",
    uploadedAt: "2024-04-02T11:30:00Z",
    verifiedBy: "hr.manager@company.com",
    verifiedAt: "2024-04-02T15:45:00Z",
    verificationComments: "Personal accident insurance policy verified. Coverage adequate.",
    renewalCost: 3500,
    currency: "LKR",
    vendor: "National Insurance Company Ltd",
    contactNumber: "+91-80-12345678",
    score: 88,
    validityPeriod: 1,
    notes: "Personal accident insurance with ₹5 lakh coverage",
    remindersSent: 0,
    daysToExpiry: 122,
    complianceScore: 90,
    riskLevel: "Low",
    attachments: ["insurance_policy.pdf", "premium_receipt.pdf", "nomination_form.pdf"],
    auditTrail: [
      {
        action: "Insurance application submitted",
        performedBy: "insurance.admin@company.com",
        timestamp: "2024-03-15T10:00:00Z"
      },
      {
        action: "Policy issued",
        performedBy: "insurance.admin@company.com",
        timestamp: "2024-04-01T09:00:00Z"
      },
      {
        action: "Policy document uploaded",
        performedBy: "insurance.admin@company.com",
        timestamp: "2024-04-02T11:30:00Z"
      },
      {
        action: "Policy verified",
        performedBy: "hr.manager@company.com",
        timestamp: "2024-04-02T15:45:00Z",
        comments: "Insurance policy verified and active"
      }
    ],
    createdAt: "2024-04-02T11:30:00Z",
    updatedAt: "2024-04-02T15:45:00Z"
  }
];

// Export all mock data
export const mockSystemData = {
  gpsLogs: mockGPSLogs,
  expiryAlerts: mockExpiryAlerts,
  notifications: mockNotifications,
  auditLogs: mockAuditLogs,
  systemSettings: mockSystemSettings,
  vehicleDocuments: mockVehicleDocuments,
  driverDocuments: mockDriverDocuments
};