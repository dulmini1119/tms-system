import type { 
  TripRequest, 
  TripApproval, 
  TripAssignment, 
  TripLog, 
  TripCost 
} from '../types/trip-interfaces';

// Mock Trip Requests Data
export const mockTripRequests: TripRequest[] = [
  {
    id: "req-001",
    requestNumber: "TR-2024-001",
    requestedBy: {
      id: "emp-001",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Sales",
      employeeId: "EMP001",
      phoneNumber: "+91-9876543210",
      designation: "Senior Sales Executive",
      managerName: "David Johnson",
      costCenter: "CC-SALES-001"
    },
    tripDetails: {
      fromLocation: {
        address: "Office Complex, Sector 62, Noida",
        coordinates: { lat: 28.6139, lng: 77.2090 },
        landmark: "Near Metro Station"
      },
      toLocation: {
        address: "Indira Gandhi International Airport, Delhi",
        coordinates: { lat: 28.5562, lng: 77.1000 },
        landmark: "Terminal 3"
      },
      departureDate: "2024-12-27",
      departureTime: "14:00",
      returnDate: "2024-12-27",
      returnTime: "20:00",
      isRoundTrip: true,
      estimatedDistance: 45,
      estimatedDuration: 90
    },
    purpose: {
      category: "Business Meeting",
      description: "Client presentation at airport hotel",
      projectCode: "PRJ-2024-15",
      costCenter: "CC-SALES-001",
      businessJustification: "Critical client meeting to close Q4 deal worth ₹50L"
    },
    requirements: {
      vehicleType: "Sedan",
      passengerCount: 2,
      specialRequirements: "AC required, professional driver",
      acRequired: true,
      luggage: "Light"
    },
    priority: "High",
    status: "Approved",
    createdAt: "2024-12-25T09:00:00Z",
    updatedAt: "2024-12-25T11:30:00Z",
    approvalRequired: true,
    estimatedCost: 2500,
    currency: "LKR",
    passengers: [
      {
        name: "John Smith",
        employeeId: "EMP001",
        department: "Sales",
        phoneNumber: "+91-9876543210"
      },
      {
        name: "Mike Wilson",
        employeeId: "EMP015",
        department: "Sales",
        phoneNumber: "+91-9876543211"
      }
    ],
    approvalWorkflow: [
      {
        level: 1,
        approverRole: "Manager",
        approverName: "David Johnson",
        approverDepartment: "Sales",
        status: "Approved",
        approvedAt: "2024-12-25T10:15:00Z",
        comments: "Approved for client meeting"
      }
    ],
    costBreakdown: {
      baseFare: 1800,
      distanceCharges: 450,
      timeCharges: 200,
      additionalCharges: 0,
      taxAmount: 50
    },
    billing: {
      billingType: "Company Paid",
      costCenter: "CC-SALES-001",
      projectCode: "PRJ-2024-15",
      budgetCode: "BUD-2024-Q4",
      billToDepartment: "Sales",
      approverName: "David Johnson"
    },
    attachments: [
      {
        fileName: "meeting_agenda.pdf",
        fileSize: "250 KB"
      }
    ],
    auditTrail: [
      {
        action: "Request created",
        performedBy: "john.smith@company.com",
        timestamp: "2024-12-25T09:00:00Z",
        comments: "Initial trip request submitted"
      },
      {
        action: "Request approved",
        performedBy: "david.johnson@company.com",
        timestamp: "2024-12-25T10:15:00Z",
        comments: "Approved by manager"
      }
    ]
  },
  {
    id: "req-002",
    requestNumber: "TR-2024-002",
    requestedBy: {
      id: "emp-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      department: "Marketing",
      employeeId: "EMP002",
      phoneNumber: "+91-9876543220",
      designation: "Marketing Manager",
      managerName: "Jennifer Wilson",
      costCenter: "CC-MKT-001"
    },
    tripDetails: {
      fromLocation: {
        address: "Corporate Office, Gurgaon",
        coordinates: { lat: 28.4595, lng: 77.0266 },
        landmark: "DLF Phase 3"
      },
      toLocation: {
        address: "India Expo Mart, Greater Noida",
        coordinates: { lat: 28.4744, lng: 77.4846 },
        landmark: "Exhibition Center"
      },
      departureDate: "2024-12-28",
      departureTime: "08:30",
      isRoundTrip: false,
      estimatedDistance: 35,
      estimatedDuration: 75
    },
    purpose: {
      category: "Conference",
      description: "Digital Marketing Summit 2024",
      projectCode: "PRJ-2024-22",
      costCenter: "CC-MKT-001",
      businessJustification: "Industry conference for latest marketing trends and networking"
    },
    requirements: {
      vehicleType: "SUV",
      passengerCount: 4,
      specialRequirements: "Space for promotional materials",
      acRequired: true,
      luggage: "Heavy"
    },
    priority: "Medium",
    status: "Assigned",
    createdAt: "2024-12-24T15:30:00Z",
    updatedAt: "2024-12-26T10:15:00Z",
    approvalRequired: true,
    estimatedCost: 1800,
    currency: "LKR",
    passengers: [
      {
        name: "Sarah Johnson",
        employeeId: "EMP002",
        department: "Marketing",
        phoneNumber: "+91-9876543220"
      },
      {
        name: "Lisa Chen",
        employeeId: "EMP016",
        department: "Marketing",
        phoneNumber: "+91-9876543221"
      },
      {
        name: "Robert Taylor",
        employeeId: "EMP017",
        department: "Marketing",
        phoneNumber: "+91-9876543222"
      },
      {
        name: "Amanda Davis",
        employeeId: "EMP018",
        department: "Marketing",
        phoneNumber: "+91-9876543223"
      }
    ],
    approvalWorkflow: [
      {
        level: 1,
        approverRole: "Manager",
        approverName: "Jennifer Wilson",
        approverDepartment: "Marketing",
        status: "Approved",
        approvedAt: "2024-12-24T16:45:00Z",
        comments: "Approved for conference attendance"
      }
    ],
    costBreakdown: {
      baseFare: 1400,
      distanceCharges: 280,
      timeCharges: 100,
      additionalCharges: 20,
      taxAmount: 0
    },
    billing: {
      billingType: "Company Paid",
      costCenter: "CC-MKT-001",
      projectCode: "PRJ-2024-22",
      budgetCode: "BUD-2024-Q4",
      billToDepartment: "Marketing",
      approverName: "Jennifer Wilson"
    },
    attachments: [
      {
        fileName: "conference_registration.pdf",
        fileSize: "180 KB"
      },
      {
        fileName: "hotel_booking.pdf",
        fileSize: "95 KB"
      }
    ],
    auditTrail: [
      {
        action: "Request created",
        performedBy: "sarah.johnson@company.com",
        timestamp: "2024-12-24T15:30:00Z",
        comments: "Conference trip request"
      },
      {
        action: "Request approved",
        performedBy: "jennifer.wilson@company.com",
        timestamp: "2024-12-24T16:45:00Z",
        comments: "Approved for team conference"
      },
      {
        action: "Vehicle assigned",
        performedBy: "fleet.admin@company.com",
        timestamp: "2024-12-26T10:15:00Z",
        comments: "SUV assigned for 4 passengers"
      }
    ]
  },
  {
    id: "req-003",
    requestNumber: "TR-2024-003",
    requestedBy: {
      id: "emp-003",
      name: "Michael Brown",
      email: "michael.brown@company.com",
      department: "IT",
      employeeId: "EMP003",
      phoneNumber: "+91-9876543230",
      designation: "Senior Software Engineer",
      managerName: "Andrew Wilson",
      costCenter: "CC-IT-001"
    },
    tripDetails: {
      fromLocation: {
        address: "Tech Park, Bangalore",
        coordinates: { lat: 12.9716, lng: 77.5946 },
        landmark: "Electronic City"
      },
      toLocation: {
        address: "Client Office, Whitefield",
        coordinates: { lat: 12.9698, lng: 77.7500 },
        landmark: "ITPL Main Road"
      },
      departureDate: "2024-12-29",
      departureTime: "10:00",
      returnDate: "2024-12-29",
      returnTime: "17:00",
      isRoundTrip: true,
      estimatedDistance: 28,
      estimatedDuration: 60
    },
    purpose: {
      category: "Client Visit",
      description: "System implementation and training",
      projectCode: "PRJ-2024-08",
      costCenter: "CC-IT-001",
      businessJustification: "Critical system deployment requiring on-site support"
    },
    requirements: {
      vehicleType: "Hatchback",
      passengerCount: 1,
      acRequired: true,
      luggage: "Light"
    },
    priority: "Medium",
    status: "In Progress",
    createdAt: "2024-12-23T11:45:00Z",
    updatedAt: "2024-12-27T14:20:00Z",
    approvalRequired: false,
    estimatedCost: 1200,
    currency: "LKR",
    passengers: [
      {
        name: "Michael Brown",
        employeeId: "EMP003",
        department: "IT",
        phoneNumber: "+91-9876543230"
      }
    ],
    costBreakdown: {
      baseFare: 900,
      distanceCharges: 200,
      timeCharges: 80,
      additionalCharges: 20,
      taxAmount: 0
    },
    billing: {
      billingType: "Company Paid",
      costCenter: "CC-IT-001",
      projectCode: "PRJ-2024-08",
      budgetCode: "BUD-2024-Q4",
      billToDepartment: "IT",
      approverName: "Andrew Wilson"
    },
    auditTrail: [
      {
        action: "Request created",
        performedBy: "michael.brown@company.com",
        timestamp: "2024-12-23T11:45:00Z",
        comments: "Client visit trip request"
      },
      {
        action: "Auto-approved",
        performedBy: "system@company.com",
        timestamp: "2024-12-23T11:45:00Z",
        comments: "Auto-approved - no approval required for this cost threshold"
      },
      {
        action: "Trip started",
        performedBy: "michael.brown@company.com",
        timestamp: "2024-12-27T14:20:00Z",
        comments: "Trip in progress"
      }
    ]
  }
];

// Mock Trip Approvals Data
export const mockTripApprovals: TripApproval[] = [
  {
    id: "app-001",
    tripRequestId: "req-001",
    requestNumber: "TR-2024-001",
    approvalWorkflow: [
      {
        level: 1,
        approverRole: "Direct Manager",
        approverName: "David Wilson",
        approverId: "mgr-001",
        approverEmail: "david.wilson@company.com",
        department: "Sales"
      },
      {
        level: 2,
        approverRole: "Finance Manager",
        approverName: "Lisa Chen",
        approverId: "fin-001",
        approverEmail: "lisa.chen@company.com",
        department: "Finance"
      }
    ],
    currentApprovalLevel: 2,
    approvalHistory: [
      {
        level: 1,
        approver: {
          id: "mgr-001",
          name: "David Wilson",
          email: "david.wilson@company.com",
          role: "Sales Manager"
        },
        action: "Approved",
        comments: "Approved for client meeting",
        timestamp: "2024-12-25T10:15:00Z",
        ipAddress: "192.168.1.10"
      },
      {
        level: 2,
        approver: {
          id: "fin-001",
          name: "Lisa Chen",
          email: "lisa.chen@company.com",
          role: "Finance Manager"
        },
        action: "Approved",
        comments: "Budget approved",
        timestamp: "2024-12-25T11:30:00Z",
        ipAddress: "192.168.1.15"
      }
    ],
    finalStatus: "Approved",
    autoApproval: false,
    approvalRules: {
      costThreshold: 2000,
      departmentApprovalRequired: true,
      managerApprovalRequired: true,
      financeApprovalRequired: true
    },
    createdAt: "2024-12-25T09:05:00Z",
    updatedAt: "2024-12-25T11:30:00Z",
    escalated: false
  },
  {
    id: "app-002",
    tripRequestId: "req-002",
    requestNumber: "TR-2024-002",
    approvalWorkflow: [
      {
        level: 1,
        approverRole: "Direct Manager",
        approverName: "Robert Taylor",
        approverId: "mgr-002",
        approverEmail: "robert.taylor@company.com",
        department: "Marketing"
      }
    ],
    currentApprovalLevel: 1,
    approvalHistory: [
      {
        level: 1,
        approver: {
          id: "mgr-002",
          name: "Robert Taylor",
          email: "robert.taylor@company.com",
          role: "Marketing Manager"
        },
        action: "Approved",
        comments: "Conference attendance approved",
        timestamp: "2024-12-24T16:45:00Z",
        ipAddress: "192.168.1.12"
      }
    ],
    finalStatus: "Approved",
    autoApproval: false,
    approvalRules: {
      costThreshold: 5000,
      departmentApprovalRequired: true,
      managerApprovalRequired: true,
      financeApprovalRequired: false
    },
    createdAt: "2024-12-24T15:35:00Z",
    updatedAt: "2024-12-24T16:45:00Z",
    escalated: false
  }
];

// Mock Trip Assignments Data
export const mockTripAssignments: TripAssignment[] = [
  {
    id: "asn-001",
    tripRequestId: "req-001",
    requestNumber: "TR-2024-001",
    assignedVehicle: {
      id: "veh-001",
      vehicleNumber: "DL-3C-AA-1234",
      make: "Honda",
      model: "City",
      type: "Sedan",
      fuelType: "Petrol",
      currentMileage: 45230,
      lastServiceDate: "2024-12-15",
      insuranceExpiryDate: "2025-06-15",
      registrationExpiryDate: "2025-03-20"
    },
    assignedDriver: {
      id: "drv-001",
      name: "Rajesh Kumar",
      licenseNumber: "DL-1420110012345",
      phoneNumber: "+91-9876543210",
      email: "rajesh.kumar@drivers.com",
      licenseExpiryDate: "2026-08-15",
      experience: 8,
      rating: 4.5,
      currentLocation: { lat: 28.6139, lng: 77.2090 },
      isAvailable: false
    },
    assignedBy: {
      id: "disp-001",
      name: "Priya Sharma",
      role: "Fleet Dispatcher",
      timestamp: "2024-12-25T12:00:00Z"
    },
    assignmentStatus: "Accepted",
    scheduledDeparture: "2024-12-27T14:00:00Z",
    scheduledReturn: "2024-12-27T20:00:00Z",
    assignmentNotes: "VIP client trip - ensure vehicle is cleaned",
    driverAcceptance: {
      accepted: true,
      timestamp: "2024-12-25T12:15:00Z",
      comments: "Confirmed for the trip"
    },
    preTrip: {
      checklist: {
        fuelLevel: 85,
        vehicleCondition: "Good",
        documentsVerified: true,
        emergencyKitPresent: true,
        gpsWorking: true
      },
      completedBy: "drv-001",
      completedAt: "2024-12-27T13:30:00Z",
      photos: ["pretrip_001.jpg", "pretrip_002.jpg"]
    },
    createdAt: "2024-12-25T12:00:00Z",
    updatedAt: "2024-12-27T13:30:00Z"
  },
  {
    id: "asn-002",
    tripRequestId: "req-002",
    requestNumber: "TR-2024-002",
    assignedVehicle: {
      id: "veh-002",
      vehicleNumber: "HR-26-CX-9876",
      make: "Mahindra",
      model: "XUV700",
      type: "SUV",
      fuelType: "Diesel",
      currentMileage: 32145,
      lastServiceDate: "2024-12-10",
      insuranceExpiryDate: "2025-08-22",
      registrationExpiryDate: "2025-05-18"
    },
    assignedDriver: {
      id: "drv-002",
      name: "Amit Singh",
      licenseNumber: "HR-0520110098765",
      phoneNumber: "+91-9123456789",
      licenseExpiryDate: "2025-12-30",
      experience: 6,
      rating: 4.2,
      currentLocation: { lat: 28.4595, lng: 77.0266 },
      isAvailable: false
    },
    assignedBy: {
      id: "disp-001",
      name: "Priya Sharma",
      role: "Fleet Dispatcher",
      timestamp: "2024-12-26T09:30:00Z"
    },
    assignmentStatus: "Started",
    scheduledDeparture: "2024-12-28T08:30:00Z",
    actualDeparture: "2024-12-28T08:25:00Z",
    assignmentNotes: "Conference trip with promotional materials",
    driverAcceptance: {
      accepted: true,
      timestamp: "2024-12-26T09:45:00Z",
      comments: "Ready for conference trip"
    },
    preTrip: {
      checklist: {
        fuelLevel: 92,
        vehicleCondition: "Good",
        documentsVerified: true,
        emergencyKitPresent: true,
        gpsWorking: true
      },
      completedBy: "drv-002",
      completedAt: "2024-12-28T08:00:00Z",
      photos: ["pretrip_003.jpg"]
    },
    createdAt: "2024-12-26T09:30:00Z",
    updatedAt: "2024-12-28T08:25:00Z"
  }
];

// Mock Trip Logs Data
export const mockTripLogs: TripLog[] = [
  {
    id: "log-001",
    tripRequestId: "req-001",
    tripAssignmentId: "asn-001",
    requestNumber: "TR-2024-001",
    vehicleId: "veh-001",
    driverId: "drv-001",
    tripStatus: "Completed",
    actualRoute: {
      startLocation: {
        lat: 28.6139,
        lng: 77.2090,
        address: "Office Complex, Sector 62, Noida",
        timestamp: "2024-12-27T14:05:00Z"
      },
      endLocation: {
        lat: 28.5562,
        lng: 77.1000,
        address: "IGI Airport Terminal 3, Delhi",
        timestamp: "2024-12-27T15:45:00Z"
      },
      waypoints: [
        { lat: 28.5355, lng: 77.1910, timestamp: "2024-12-27T14:25:00Z" },
        { lat: 28.5245, lng: 77.1456, timestamp: "2024-12-27T15:15:00Z" }
      ],
      totalDistance: 47.5,
      totalDuration: 100
    },
    timing: {
      scheduledStart: "2024-12-27T14:00:00Z",
      actualStart: "2024-12-27T14:05:00Z",
      scheduledEnd: "2024-12-27T20:00:00Z",
      actualEnd: "2024-12-27T20:15:00Z",
      delays: [
        {
          reason: "Heavy traffic on NH24",
          duration: 15,
          timestamp: "2024-12-27T14:30:00Z"
        }
      ],
      waitingTime: 45
    },
    gpsTracking: {
      trackingId: "gps-001-20241227",
      enabled: true,
      lastPing: "2024-12-27T20:15:00Z",
      speedAlerts: 2,
      geoFenceViolations: 0
    },
    fuelConsumption: {
      startReading: 45230,
      endReading: 45277.5,
      fuelUsed: 4.2,
      fuelCostPerLiter: 102.50,
      fuelStations: []
    },
    incidents: [],
    passengerFeedback: {
      rating: 5,
      comments: "Excellent service, professional driver, clean vehicle",
      timestamp: "2024-12-27T20:30:00Z",
      categories: {
        driverBehavior: 5,
        vehicleCondition: 5,
        punctuality: 4,
        routeOptimization: 4
      }
    },
    postTrip: {
      vehicleCondition: "Good",
      maintenanceRequired: false,
      cleaningRequired: true,
      fuelLevel: 75,
      mileageEnd: 45277.5,
      photos: ["posttrip_001.jpg"],
      completedBy: "drv-001",
      completedAt: "2024-12-27T20:30:00Z"
    },
    createdAt: "2024-12-27T14:05:00Z",
    updatedAt: "2024-12-27T20:30:00Z"
  },
  {
    id: "log-002",
    tripRequestId: "req-002",
    tripAssignmentId: "asn-002",
    requestNumber: "TR-2024-002",
    vehicleId: "veh-002",
    driverId: "drv-002",
    tripStatus: "In Transit",
    actualRoute: {
      startLocation: {
        lat: 28.4595,
        lng: 77.0266,
        address: "Corporate Office, Gurgaon",
        timestamp: "2024-12-28T08:25:00Z"
      },
      endLocation: {
        lat: 28.4744,
        lng: 77.4846,
        address: "India Expo Mart, Greater Noida",
        timestamp: ""
      },
      waypoints: [
        { lat: 28.4211, lng: 77.0789, timestamp: "2024-12-28T08:45:00Z" },
        { lat: 28.4500, lng: 77.2500, timestamp: "2024-12-28T09:15:00Z" }
      ],
      totalDistance: 0,
      totalDuration: 0
    },
    timing: {
      scheduledStart: "2024-12-28T08:30:00Z",
      actualStart: "2024-12-28T08:25:00Z",
      scheduledEnd: "2024-12-28T10:00:00Z",
      delays: [],
      waitingTime: 0
    },
    gpsTracking: {
      trackingId: "gps-002-20241228",
      enabled: true,
      lastPing: "2024-12-28T09:30:00Z",
      currentLocation: { lat: 28.4500, lng: 77.2500 },
      speedAlerts: 0,
      geoFenceViolations: 0
    },
    fuelConsumption: {
      startReading: 32145,
      fuelCostPerLiter: 95.50
    },
    incidents: [],
    postTrip: {
      vehicleCondition: "Good",
      maintenanceRequired: false,
      cleaningRequired: false,
      fuelLevel: 85,
      mileageEnd: 0,
      completedBy: "",
      completedAt: ""
    },
    createdAt: "2024-12-28T08:25:00Z",
    updatedAt: "2024-12-28T09:30:00Z"
  }
];

// Mock Trip Costs Data
export const mockTripCosts: TripCost[] = [
  {
    id: "cost-001",
    tripRequestId: "req-001",
    tripLogId: "log-001",
    requestNumber: "TR-2024-001",
    costBreakdown: {
      driverCharges: {
        baseFare: 1200,
        timeCharges: 400,
        overtimeCharges: 150,
        nightCharges: 0,
        holidayCharges: 0,
        waitingCharges: 225,
        total: 1975
      },
      vehicleCosts: {
        fuelCost: 430.50,
        maintenanceCost: 47.50,
        depreciationCost: 95,
        insuranceCost: 12.50,
        total: 585.50
      },
      additionalCosts: {
        tolls: [
          {
            amount: 45,
            location: "DND Flyway",
            timestamp: "2024-12-27T14:20:00Z"
          },
          {
            amount: 35,
            location: "Airport Express",
            timestamp: "2024-12-27T15:30:00Z"
          }
        ],
        parking: [
          {
            amount: 100,
            location: "Airport Terminal 3",
            duration: 180,
            timestamp: "2024-12-27T15:45:00Z"
          }
        ],
        permits: 0,
        other: []
      },
      totalAdditionalCosts: 180
    },
    totalCost: 2740.50,
    estimatedCost: 2500,
    variance: 240.50,
    variancePercentage: 9.62,
    currency: "LKR",
    billing: {
      billToUser: "john.smith@company.com",
      billToDepartment: "Sales",
      costCenter: "CC-SALES-001",
      projectCode: "PRJ-2024-15",
      budgetCode: "BG-2024-SALES",
      taxAmount: 493.29,
      taxPercentage: 18,
      netAmount: 2740.50,
      grossAmount: 3233.79
    },
    payment: {
      status: "Paid",
      method: "Company Account",
      transactionId: "TXN-001-20241227",
      paidDate: "2024-12-28T10:00:00Z",
      paidBy: "finance.system@company.com"
    },
    receipts: [
      {
        id: "rcpt-001",
        type: "Toll",
        amount: 45,
        vendor: "DND Flyway",
        receiptNumber: "DND-12345",
        imageUrl: "receipts/toll_001.jpg",
        timestamp: "2024-12-27T14:20:00Z"
      },
      {
        id: "rcpt-002",
        type: "Toll",
        amount: 35,
        vendor: "Airport Express",
        receiptNumber: "AE-67890",
        imageUrl: "receipts/toll_002.jpg",
        timestamp: "2024-12-27T15:30:00Z"
      },
      {
        id: "rcpt-003",
        type: "Parking",
        amount: 100,
        vendor: "Delhi Airport",
        receiptNumber: "PARK-98765",
        imageUrl: "receipts/parking_001.jpg",
        timestamp: "2024-12-27T15:45:00Z"
      }
    ],
    approvals: {
      financeApproval: {
        required: true,
        approved: true,
        approvedBy: "lisa.chen@company.com",
        approvedAt: "2024-12-27T21:00:00Z",
        comments: "Approved for payment"
      },
      managerApproval: {
        required: true,
        approved: true,
        approvedBy: "david.wilson@company.com",
        approvedAt: "2024-12-27T20:45:00Z",
        comments: "Variance within acceptable range"
      }
    },
    createdAt: "2024-12-27T20:30:00Z",
    updatedAt: "2024-12-28T10:00:00Z",
    auditTrail: [
      {
        action: "Created",
        performedBy: "system",
        timestamp: "2024-12-27T20:30:00Z"
      },
      {
        action: "Manager Approval",
        performedBy: "david.wilson@company.com",
        timestamp: "2024-12-27T20:45:00Z"
      },
      {
        action: "Finance Approval",
        performedBy: "lisa.chen@company.com",
        timestamp: "2024-12-27T21:00:00Z"
      },
      {
        action: "Payment Processed",
        performedBy: "finance.system@company.com",
        timestamp: "2024-12-28T10:00:00Z"
      }
    ]
  },
  {
    id: "cost-002",
    tripRequestId: "req-002",
    tripLogId: "log-002",
    requestNumber: "TR-2024-002",
    costBreakdown: {
      driverCharges: {
        baseFare: 800,
        timeCharges: 200,
        overtimeCharges: 0,
        nightCharges: 0,
        holidayCharges: 0,
        waitingCharges: 0,
        total: 1000
      },
      vehicleCosts: {
        fuelCost: 286.50,
        maintenanceCost: 35,
        depreciationCost: 70,
        insuranceCost: 15,
        total: 406.50
      },
      additionalCosts: {
        tolls: [
          {
            amount: 60,
            location: "Yamuna Expressway",
            timestamp: "2024-12-28T09:00:00Z"
          }
        ],
        parking: [],
        permits: 0,
        other: []
      },
      totalAdditionalCosts: 60
    },
    totalCost: 1466.50,
    estimatedCost: 1800,
    variance: -333.50,
    variancePercentage: -18.53,
    currency: "LKR",
    billing: {
      billToUser: "sarah.johnson@company.com",
      billToDepartment: "Marketing",
      costCenter: "CC-MKT-001",
      projectCode: "PRJ-2024-22",
      budgetCode: "BG-2024-MKT",
      taxAmount: 263.97,
      taxPercentage: 18,
      netAmount: 1466.50,
      grossAmount: 1730.47
    },
    payment: {
      status: "Pending",
      method: "Company Account"
    },
    receipts: [
      {
        id: "rcpt-004",
        type: "Toll",
        amount: 60,
        vendor: "Yamuna Expressway",
        receiptNumber: "YE-11223",
        imageUrl: "receipts/toll_003.jpg",
        timestamp: "2024-12-28T09:00:00Z"
      }
    ],
    approvals: {
      financeApproval: {
        required: false
      },
      managerApproval: {
        required: true,
        approved: false
      }
    },
    createdAt: "2024-12-28T09:30:00Z",
    updatedAt: "2024-12-28T09:30:00Z",
    auditTrail: [
      {
        action: "Created",
        performedBy: "system",
        timestamp: "2024-12-28T09:30:00Z"
      }
    ]
  }
];

// Export all mock data
export const mockTripData = {
  requests: mockTripRequests,
  approvals: mockTripApprovals,
  assignments: mockTripAssignments,
  logs: mockTripLogs,
  costs: mockTripCosts
};