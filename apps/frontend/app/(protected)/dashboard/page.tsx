"use client";

import React from "react";
import { KpiCard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import { FilterDrawer } from "@/components/filter-drawer";
import { RoleSelect } from "@/components/role-select";
import { SearchInput } from "@/components/search-input";
import { DateRangePicker } from "@/components/date-range-picker";
import { Card, CardContent } from "@/components/ui/card";
import { service } from "@/lib/api";
import { defaultFilters, loadFilters, saveFilters } from "@/lib/filters";
import type { Filters, User } from "@/types";
import { EmptyState } from "@/components/empty-state";
import { UsersTable } from "@/components/users-table";
import { useToast } from "@/hooks/use-toast";
import { UserDialog } from "@/components/user-dialog";
import { AuthContext } from "@/components/protected-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddUserDialog } from "@/components/add-user-dialog";

export default function Page() {
  const storageKey = "dashboard";
  const { user } = React.useContext(AuthContext);
  const canAdmin = user?.role === "admin";

  const [filters, setFilters] = React.useState<Filters>(() =>
    typeof window === "undefined" ? defaultFilters() : loadFilters(storageKey),
  );
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<any>(null);
  const [signups, setSignups] = React.useState<{ date: string; count: number }[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">(filters.sort?.endsWith(":asc") ? "asc" : "desc");
  const [chartRev, setChartRev] = React.useState(0); // re-animate chart on refresh
  const { toast } = useToast();

  React.useEffect(() => {
    saveFilters(storageKey, { ...filters, page, sort: `createdAt:${sortDir}` });
  }, [filters, page, sortDir]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const [sum, s, u] = await Promise.all([
        service.getSummary({ start: filters.start, end: filters.end }),
        service.getSignups({ start: filters.start, end: filters.end, interval: "day" }),
        service.getUsers({ ...filters, page, limit: filters.limit ?? 10, sort: `createdAt:${sortDir}` }),
      ]);
      setSummary(sum);
      setSignups(s);
      setUsers(u.data);
      setTotal(u.total);
      setChartRev((r) => r + 1);
      window.dispatchEvent(new CustomEvent("classboard:refresh-charts"));
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortDir, toast]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const dateRange = {
    from: filters.start ? new Date(filters.start) : undefined,
    to: filters.end ? new Date(filters.end) : undefined,
  };

  const trend = signups.slice(-16).map((d, i) => ({ x: i, y: d.count }));

  const [dialogUser, setDialogUser] = React.useState<User | null>(null);
  const [dialogMode, setDialogMode] = React.useState<"view" | "edit" | "disable">("view");
  const closeDialog = () => setDialogUser(null);

  const [adding, setAdding] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={(r) =>
              setFilters({
                ...filters,
                start: r.from?.toISOString(),
                end: r.to?.toISOString(),
                page: 1,
              })
            }
          />
          <RoleSelect value={(filters.role as any) || "all"} onChange={(r) => setFilters({ ...filters, role: r, page: 1 })} />
        </div>
        <div className="md:ml-auto flex items-center gap-2">
          <SearchInput value={filters.q || ""} onChange={(q) => setFilters({ ...filters, q, page: 1 })} />
          <FilterDrawer
            value={{ role: (filters.role as any) || "all", q: filters.q || "", date: dateRange }}
            onChange={(v) => {
              setFilters({
                ...filters,
                role: v.role,
                q: v.q,
                start: v.date.from?.toISOString(),
                end: v.date.to?.toISOString(),
                page: 1,
              });
            }}
          />
          {canAdmin && (
            <Button onClick={() => setAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value={summary?.totalUsers ?? 0} delta={summary?.deltas?.users ?? 0} loading={loading} trend={trend} />
        <KpiCard title="Teachers" value={summary?.totalTeachers ?? 0} delta={summary?.deltas?.teachers ?? 0} loading={loading} trend={trend} />
        <KpiCard title="Students" value={summary?.totalStudents ?? 0} delta={summary?.deltas?.students ?? 0} loading={loading} trend={trend} />
        <KpiCard title="Weekly Signups" value={summary?.weeklySignups ?? 0} delta={summary?.deltas?.weeklySignups ?? 0} loading={loading} trend={trend} />
      </div>

      <ChartCard title="Signups Over Time" data={signups} loading={loading} height={56} revision={chartRev} />

      <Card className="rounded-md">
        <CardContent className="p-0">
          {!loading && users.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No users match your filters"
                description="Try adjusting or clearing filters."
                onReset={() => setFilters({ ...filters, role: "all", q: "", page: 1 })}
              />
            </div>
          ) : (
            <div className="p-3">
              <UsersTable
                data={users}
                page={page}
                total={total}
                limit={filters.limit ?? 10}
                onPageChange={(p) => setPage(p)}
                onSortToggle={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                sortDir={sortDir}
                canAdmin={canAdmin}
                onBulkDisable={async (ids) => {
                  if (!canAdmin) return;
                  try {
                    // use server bulk endpoint (faster + fewer requests)
                    await service.bulkUpdate(ids, { disabled: true });
                    toast({ title: "Disabled", description: `${ids.length} user(s) disabled` });
                    await refresh();
                  } catch (e: any) {
                    toast({ title: "Error", description: e?.message ?? "Failed to disable", variant: "destructive" });
                  }
                }}
                onRowAction={async (action, u) => {
                  if (action === "disable") {
                    if (!canAdmin) return;
                    try {
                      await service.updateUserById(u.id, { disabled: true });
                      toast({ title: "User disabled", description: `${u.name} has been disabled.` });
                      await refresh();
                    } catch (e: any) {
                      toast({ title: "Error", description: e?.message ?? "Failed to disable user", variant: "destructive" });
                    }
                    return;
                  }
                  if (action === "enable") {
                    if (!canAdmin) return;
                    try {
                      await service.updateUserById(u.id, { disabled: false });
                      toast({ title: "User enabled", description: `${u.name} has been re-activated.` });
                      await refresh();
                    } catch (e: any) {
                      toast({ title: "Error", description: e?.message ?? "Failed to enable user", variant: "destructive" });
                    }
                    return;
                  }
                  setDialogMode(action as "view" | "edit" | "disable");
                  setDialogUser(u);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <UserDialog user={dialogUser} open={!!dialogUser} mode={dialogMode} onClose={closeDialog} onSaved={refresh} />

      {canAdmin && (
        <AddUserDialog
          open={adding}
          onOpenChange={setAdding}
          onSubmit={async (vals) => {
            try {
              // Backend requires a password for admin-created users.
              // Use a default, or extend your dialog to collect one.
              await service.createUser({
                name: vals.name,
                email: vals.email,
                role: vals.role,
                bio: vals.bio,
                password: "Password@123", // TODO: generate or collect securely
              });
              toast({ title: "User added", description: `${vals.name} (${vals.role})` });
              await refresh();
            } catch (e: any) {
              toast({ title: "Add failed", description: e?.message ?? "Please try again", variant: "destructive" });
            }
          }}
        />
      )}
    </div>
  );
}
