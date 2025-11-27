"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string | null;
  module: string;
  action: string;
  resource: string;
}

const ROLES = [
  { id: "1", name: "Super Admin" },
  { id: "2", name: "Vehicle Admin" },
  { id: "3", name: "Manager" },
  { id: "4", name: "HOD" },
  { id: "5", name: "Employee" },
  { id: "6", name: "Driver" },
];

export default function PermissionMatrixPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Load all permissions
      const permsRes = await api.get("/permissions/all");
      const perms: Permission[] = permsRes.data.data || [];
      setPermissions(perms);

      // 2. Load current role → permission assignments
      const matrixRes = await api.get("/permissions"); // ← this is your original matrix endpoint
      const { roleMap } = matrixRes.data.data;

      // If no data from backend yet, give Super Admin all permissions by default
      const defaultRoleMap: Record<string, string[]> = roleMap || {
        "1": perms.map((p) => p.id), // Super Admin gets everything
      };

      // Ensure every role exists in the map
      ROLES.forEach((role) => {
        if (!defaultRoleMap[role.id]) {
          defaultRoleMap[role.id] = [];
        }
      });

      setRolePermissions(defaultRoleMap);
    } catch (err) {
      toast.error( "Failed to load permissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const togglePermission = (roleId: string, permissionId: string, checked: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [roleId]: checked
        ? [...new Set([...(prev[roleId] || []), permissionId])]
        : (prev[roleId] || []).filter((id) => id !== permissionId),
    }));
  };

  // REAL SAVE FUNCTION — THIS WORKS WITH YOUR BACKEND
const handleSave = async () => {
  setSaving(true);

  try {
    const payloads = ROLES.map((role) => ({
      roleId: role.id,
      permissionIds: rolePermissions[role.id] || [], // ← THIS IS CRITICAL
    }));

    // DEBUG: remove this in production
    console.log("Sending to backend:", payloads);

    await Promise.all(
      payloads.map((payload) =>
        api.post("/permissions/save", payload)
      )
    );

    toast.success("All role permissions saved successfully!");
  } catch (err) {
    console.error("Save error:", err);
    toast.error(
      "Validation failed — check console for details"
    );
  } finally {
    setSaving(false);
  }
};

  // Group permissions by module
  const grouped = permissions.reduce((acc, perm) => {
    const category = perm.module || "Other";
    (acc[category] ||= []).push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">PERMISSION MATRIX</h1>
          <p className="text-muted-foreground">
            Manage role-based permissions across all modules
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleSave}
          disabled={saving || loading}
          className="min-w-40 bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>

      {/* Matrix Cards */}
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, perms]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <CardTitle className="flex items-center gap-3">
                <div className="w-2 h-10 bg-cyan-600 rounded-full" />
                <div>
                  <span className="text-xl font-bold">
                    {category.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <Badge variant="secondary" className="ml-3">
                    {perms.length} permissions
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="sticky left-0 z-10 bg-background w-80 font-bold">
                        Permission
                      </TableHead>
                      {ROLES.map((role) => (
                        <TableHead key={role.id} className="text-center font-semibold">
                          {role.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perms.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell className="sticky left-0 z-10 bg-background font-medium">
                          <div>
                            <div className="font-semibold">{perm.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {perm.code}
                            </div>
                            {perm.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {perm.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        {ROLES.map((role) => (
                          <TableCell key={role.id} className="text-center">
                            <Checkbox
                              checked={rolePermissions[role.id]?.includes(perm.id) ?? false}
                              onCheckedChange={(checked) =>
                                togglePermission(role.id, perm.id, checked as boolean)
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
    </div>
  );
}