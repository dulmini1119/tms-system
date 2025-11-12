'use client'
import React, { useState } from 'react';

import { Clock, MapPin, Car, Calendar, Play, Square, CheckCircle, AlertTriangle, Route, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserRole {
  id: string;
  name: string;
  role: string;
  department: string;
  businessUnit: string;
}


// Mock data for driver dashboard
const mockStats = {
  todayTrips: 3,
  activeTrips: 1,
  completedTrips: 2,
  totalDistance: 45
};

const mockTodayAssignments = [
  {
    id: 'TR001',
    employee: 'John Smith',
    department: 'Marketing',
    destination: 'Downtown Office',
    fromLocation: 'Home - Koramangala',
    scheduledTime: '09:00 AM',
    estimatedDuration: '2 hours',
    status: 'completed',
    actualStartTime: '09:05 AM',
    actualEndTime: '11:15 AM',
    distance: '15 km'
  },
  {
    id: 'TR002',
    employee: 'Sarah Wilson',
    department: 'Sales',
    destination: 'Airport',
    fromLocation: 'Office - MG Road',
    scheduledTime: '02:30 PM',
    estimatedDuration: '3 hours',
    status: 'active',
    actualStartTime: '02:35 PM',
    actualEndTime: null,
    distance: '25 km'
  },
  {
    id: 'TR003',
    employee: 'David Brown',
    department: 'IT',
    destination: 'Client Office - Whitefield',
    fromLocation: 'Office - Brigade Road',
    scheduledTime: '04:00 PM',
    estimatedDuration: '2.5 hours',
    status: 'scheduled',
    actualStartTime: null,
    actualEndTime: null,
    distance: '30 km'
  }
];

const mockVehicleInfo = {
  make: 'Honda',
  model: 'City',
  year: '2022',
  licensePlate: 'KA01AB1234',
  fuelLevel: 75,
  mileage: 45000,
  lastService: '2024-01-01',
  nextService: '2024-04-01'
};

export default function DriverDashboard() {
  const [currentTrip, setCurrentTrip] = useState(mockTodayAssignments.find(trip => trip.status === 'active'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'active':
        return 'default';
      case 'scheduled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'active':
        return <Navigation className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const startTrip = (tripId: string) => {
    // Handle trip start logic
    console.log('Starting trip:', tripId);
  };

  const endTrip = (tripId: string) => {
    // Handle trip end logic
    console.log('Ending trip:', tripId);
  };

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className='p-3'>
          <h1 className="text-2xl font-bold">Welcome,!</h1>
          <p className="text-muted-foreground">
             Vehicle: {mockVehicleInfo.make} {mockVehicleInfo.model}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Car className="h-3 w-3" />
            {mockVehicleInfo.licensePlate}
          </Badge>
        </div>
      </div>

      {/* Current Trip Status */}
      {currentTrip && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Active Trip in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-900">
              <div>
                <h4 className="font-medium">Trip Details</h4>
                <p className="text-sm">Trip ID: {currentTrip.id}</p>
                <p className="text-sm">Employee: {currentTrip.employee}</p>
                <p className="text-sm">Department: {currentTrip.department}</p>
              </div>
              <div>
                <h4 className="font-medium">Route</h4>
                <p className="text-sm">From: {currentTrip.fromLocation}</p>
                <p className="text-sm">To: {currentTrip.destination}</p>
                <p className="text-sm">Distance: {currentTrip.distance}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Time</h4>
                  <p className="text-sm">Started: {currentTrip.actualStartTime}</p>
                  <p className="text-sm">Expected: {currentTrip.estimatedDuration}</p>
                </div>
                <Button 
                  onClick={() => endTrip(currentTrip.id)}
                  className="bg-red-600 hover:bg-red-700 gap-2"
                >
                  <Square className="h-4 w-4" />
                  End Trip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Todays Trips</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.todayTrips}</div>
            <p className="text-xs text-muted-foreground">
              Total assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeTrips}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedTrips}</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalDistance} km</div>
            <p className="text-xs text-muted-foreground">
              Todays total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Todays Trip Assignments</CardTitle>
            <CardDescription>Your scheduled trips for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTodayAssignments.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{trip.destination}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Employee: {trip.employee} ({trip.department})
                    </div>
                    <div className="text-sm text-muted-foreground">
                      From: {trip.fromLocation}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Scheduled: {trip.scheduledTime} • {trip.distance}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(trip.status)} className="gap-1">
                      {getStatusIcon(trip.status)}
                      {trip.status}
                    </Badge>
                    {trip.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={() => startTrip(trip.id)}
                        className="gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Current vehicle assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {mockVehicleInfo.make} {mockVehicleInfo.model} ({mockVehicleInfo.year})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    License: {mockVehicleInfo.licensePlate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Fuel Level</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${mockVehicleInfo.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-sm">{mockVehicleInfo.fuelLevel}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mileage</Label>
                  <p className="text-sm mt-1">{mockVehicleInfo.mileage.toLocaleString()} km</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Last Service</Label>
                  <p className="text-sm mt-1">{mockVehicleInfo.lastService}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Service</Label>
                  <p className="text-sm mt-1">{mockVehicleInfo.nextService}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Report Vehicle Issue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}