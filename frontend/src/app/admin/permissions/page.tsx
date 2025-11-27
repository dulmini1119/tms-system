"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Shield, Loader2 } from "lucide-react";
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
      const res = await api.get<{ success: boolean; data: Permission[] }>("/permissions/all");
      const perms = res.data.data || [];
      setPermissions(perms);

 
      const defaultRoleMap: Record<string, string[]> = {
        "1": perms.map((p) => p.id),
      };

      // Others empty
      ROLES.forEach((r) => {
        if (!defaultRoleMap[r.id]) defaultRoleMap[r.id] = [];
      });

      setRolePermissions(defaultRoleMap);
    } catch (err) {
      toast.error("Failed to load permissions");
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
        ? [...(prev[roleId] || []), permissionId]
        : (prev[roleId] || []).filter((id) => id !== permissionId),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    // TODO: replace with real API endpoint
    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Permissions saved! (demo mode)");
    setSaving(false);
  };

  // GROUP PERMISSIONS BY CATEGORY (module)
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="p-3">
            <h1 className="text-2xl">PERMISSION MANAGEMENT</h1>
          <p className="text-muted-foreground text-xs">
            Categorized by module — User Management, Vehicle Management, Trip Management, Finance, etc.
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <span>Save Changes</span>
          )}
        </Button>
      </div>

      {/* Matrix by category */}
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, perms]) => (
          <Card
            key={category}
            className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b">
              <CardTitle className="flex items-center gap-3 py-4">
                <div className="w-1.5 h-8 bg-slate-800 dark:bg-slate-200 rounded-sm" />
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {category.replaceAll("_", " ").toUpperCase()}
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {perms.length} items
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-900/50">
                      <TableHead className="sticky left-0 bg-white dark:bg-slate-950 z-20 w-96 font-semibold text-slate-800 dark:text-slate-100 border-r">
                        Permission
                      </TableHead>

                      {ROLES.map((role) => (
                        <TableHead
                          key={role.id}
                          className="text-center min-w-[140px] font-medium text-slate-700 dark:text-slate-200"
                        >
                          {role.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {perms.map((perm) => (
                      <TableRow
                        key={perm.id}
                        className="even:bg-white odd:bg-slate-50 dark:even:bg-slate-950 dark:odd:bg-slate-900/60"
                      >
                        <TableCell className="sticky left-0 bg-white dark:bg-slate-950 z-10 border-r">
                          <div className="flex flex-col">
                            <div className="font-medium text-slate-800 dark:text-slate-100">{perm.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                              {perm.code}
                            </div>
                            {perm.description && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {perm.description}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {ROLES.map((role) => (
                          <TableCell key={role.id} className="text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={rolePermissions[role.id]?.includes(perm.id) ?? false}
                                onCheckedChange={(checked) =>
                                  togglePermission(role.id, perm.id, checked as boolean)
                                }
                                className="h-5 w-5 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800 dark:data-[state=checked]:bg-slate-200 dark:data-[state=checked]:border-slate-200"
                              />
                            </div>
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
