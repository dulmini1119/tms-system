"use client"
import React, { useState } from 'react';

import { 
  Shield, 
  CheckSquare, 
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const permissions = [
  { id: 'user_create', name: 'Create Users', category: 'User Management' },
  { id: 'user_edit', name: 'Edit Users', category: 'User Management' },
  { id: 'user_delete', name: 'Delete Users', category: 'User Management' },
  { id: 'user_view', name: 'View Users', category: 'User Management' },
  { id: 'vehicle_create', name: 'Create Vehicles', category: 'Vehicle Management' },
  { id: 'vehicle_edit', name: 'Edit Vehicles', category: 'Vehicle Management' },
  { id: 'vehicle_delete', name: 'Delete Vehicles', category: 'Vehicle Management' },
  { id: 'vehicle_view', name: 'View Vehicles', category: 'Vehicle Management' },
  { id: 'trip_request', name: 'Request Trips', category: 'Trip Management' },
  { id: 'trip_approve', name: 'Approve Trips', category: 'Trip Management' },
  { id: 'trip_assign', name: 'Assign Trips', category: 'Trip Management' },
  { id: 'trip_execute', name: 'Execute Trips', category: 'Trip Management' },
  { id: 'reports_view', name: 'View Reports', category: 'Reporting' },
  { id: 'reports_export', name: 'Export Reports', category: 'Reporting' },
  { id: 'settings_manage', name: 'Manage Settings', category: 'System Administration' },
  { id: 'audit_view', name: 'View Audit Logs', category: 'System Administration' }
];

const roles = [
  { id: 'admin', name: 'Admin' },
  {id:'vehicleadmin', name:"VehicleAdmin"},
  { id: 'manager', name: 'Manager' },
  { id: 'employee', name: 'Employee' },
  { id: 'driver', name: 'Driver' },
  { id: 'hod', name: 'HOD' }
];

const initialPermissions: Record<string, string[]> = {
  admin: permissions.map(p => p.id),
  vehicleadmin: ['trip_assign'],
  manager: ['user_view', 'trip_approve', 'reports_view'],
  employee: ['trip_request'],
  driver: ['trip_execute'],
  hod: ['user_view', 'trip_approve', 'reports_view', 'reports_export']
};

export default function Permissions() {
  const [rolePermissions, setRolePermissions] = useState(initialPermissions);

  const handlePermissionChange = (roleId: string, permissionId: string, checked: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: checked 
        ? [...prev[roleId], permissionId]
        : prev[roleId].filter(p => p !== permissionId)
    }));
  };

  //backend connection for the save button
  // const handleSaveChanges = async () => {
  //   try {
  //     // Example: Save to backend
  //     await fetch("/api/permissions", {
  //       method: "POST",
  //       body: JSON.stringify(rolePermissions),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     toast.success("Permissions saved successfully");
  //   } catch (error) {
  //     console.error("Failed to save permissions:", error);
  //     toast.error("Failed to save permissions");
  //   }
  // };

  const hasPermission = (roleId: string, permissionId: string) => {
    return rolePermissions[roleId]?.includes(permissionId) || false;
  };

  const getPermissionsByCategory = () => {
    const categories: Record<string, typeof permissions> = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const permissionsByCategory = getPermissionsByCategory();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className='p-3'>
          <h1 className='text-2xl'>PERMISSION MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">
            Assign permissions to roles using the matrix below
          </p>
        </div>
        <Button className='hover:bg-cyan-700'>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5" />
              <span>{category}</span>
            </CardTitle>
            <CardDescription>
              Manage {category.toLowerCase()} permissions for each role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Permission</TableHead>
                    {roles.map(role => (
                      <TableHead key={role.id} className="text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <Shield className="h-4 w-4" />
                          <span>{role.name}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryPermissions.map(permission => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {permission.id}
                          </div>
                        </div>
                      </TableCell>
                      {roles.map(role => (
                        <TableCell key={role.id} className="text-center">
                          <Checkbox
                            checked={hasPermission(role.id, permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(role.id, permission.id, checked as boolean)
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
          <CardDescription>
            Overview of permissions assigned to each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map(role => (
              <div key={role.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">{role.name}</span>
                  <Badge variant="secondary">
                    {rolePermissions[role.id]?.length || 0} permissions
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {rolePermissions[role.id]?.slice(0, 3).map(permId => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm?.name;
                  }).join(', ')}
                  {(rolePermissions[role.id]?.length || 0) > 3 && 
                    ` +${(rolePermissions[role.id]?.length || 0) - 3} more`
                  }
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}