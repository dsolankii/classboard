"use client";

import React from "react";
import { service } from "@/lib/api";
import { defaultFilters, loadFilters, saveFilters } from "@/lib/filters";
import type { Filters, User } from "@/types";
import { SearchInput } from "@/components/search-input";
import { RoleSelect } from "@/components/role-select";
import { DateRangePicker } from "@/components/date-range-picker";
import { DataToolbar } from "@/components/data-toolbar";
import { UsersTable } from "@/components/users-table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/empty-state";
import { AuthContext } from "@/components/protected-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddUserDialog } from "@/components/add-user-dialog";
import { FilterDrawer } from "@/components/filter-drawer";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const storageKey = "users";
  const { user: me } = React.useContext(AuthContext);
  const canAdmin = me?.role === "admin";

  const [filters, setFilters] = React.useState<Filters>(() =>
    typeof window === "undefined" ? defaultFilters() : loadFilters(storageKey),
  );
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState<User[]>([]);
  const [page, setPage] = React.useState(filters.page ?? 1);
  const [total, setTotal] = React.useState(0);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">(filters.sort?.endsWith(":asc") ? "asc" : "desc");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [adding, setAdding] = React.useState(false);
  const { toast } = useToast();
  const params = useSearchParams();

  // Sync ?q= from URL
  React.useEffect(() => {
    const urlQ = params?.get("q") || "";
    if ((filters.q || "") !== urlQ) {
      setFilters((f) => ({ ...f, q: urlQ, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  React.useEffect(() => {
    saveFilters(storageKey, { ...filters, page, sort: `createdAt:${sortDir}` });
  }, [filters, page, sortDir]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.getUsers({
        ...filters,
        // default search behavior: names that START with the query
        scope: "name",
        mode: "startsWith",
        page,
        limit: filters.limit ?? 10,
        sort: `createdAt:${sortDir}`,
      });
      setList(res.data);
      setTotal(res.total);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Failed to load users", variant: "destructive" });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={(r) =>
              setFilters({ ...filters, start: r.from?.toISOString(), end: r.to?.toISOString(), page: 1 })
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

      <DataToolbar
        chips={
          [
            filters.role && filters.role !== "all"
              ? { label: `Role: ${filters.role}`, onRemove: () => setFilters({ ...filters, role: "all", page: 1 }) }
              : null,
            filters.q ? { label: `Keyword: ${filters.q}`, onRemove: () => setFilters({ ...filters, q: "", page: 1 }) } : null,
          ].filter(Boolean) as any
        }
        onClear={() => setFilters({ ...filters, role: "all", q: "", page: 1 })}
        onOpenFilters={() => window.dispatchEvent(new CustomEvent("classboard:toggle-filters"))}
      />

      {!loading && list.length === 0 ? (
        <EmptyState
          title="No users"
          description="Adjust filters or reset to see results."
          onReset={() => setFilters(defaultFilters())}
        />
      ) : (
        <UsersTable
          data={list}
          page={page}
          total={total}
          limit={filters.limit ?? 10}
          onPageChange={(p) => setPage(p)}
          onSortToggle={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          sortDir={sortDir}
          canAdmin={canAdmin}
          onRowAction={() => {}}
          onBulkDisable={() => {}}
          onRowClick={(u) => setSelectedUser(u)}
        />
      )}

      <Drawer open={!!selectedUser} onOpenChange={(o) => !o && setSelectedUser(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>User details</DrawerTitle>
          </DrawerHeader>
          {selectedUser ? (
            <div className="p-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Name:</span> {selectedUser.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Email:</span> {selectedUser.email}
              </div>
              <div className="text-sm">
                <span className="font-medium">Role:</span> {selectedUser.role}
              </div>
              <div className="text-sm">
                <span className="font-medium">Joined:</span>{" "}
                {selectedUser.createdAt?.slice(0, 10).replace(/-/g, "/")}
              </div>
              <div className="text-sm text-muted-foreground">{selectedUser.bio || "No bio"}</div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>

      {canAdmin && (
        <AddUserDialog
          open={adding}
          onOpenChange={setAdding}
          onSubmit={async (vals) => {
            try {
              // Backend requires a password. Use a default or extend the dialog to collect one.
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
