"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RoleSelect } from "@/components/role-select"
import { useToast } from "@/hooks/use-toast"
import type { User, Role } from "@/types"
import { service } from "@/lib/api"
import { AuthContext } from "@/components/protected-layout"

type Mode = "view" | "edit" | "disable"

export function UserDialog({
  user,
  open,
  mode,
  onClose,
  onSaved,
}: {
  user: User | null
  open: boolean
  mode: Mode
  onClose: () => void
  onSaved: () => void
}) {
  const { toast } = useToast()
  const [name, setName] = React.useState(user?.name ?? "")
  const [role, setRole] = React.useState<Role>((user?.role as Role) ?? "student")
  const [bio, setBio] = React.useState(user?.bio ?? "")
  const { user: me } = React.useContext(AuthContext)
  const canAdmin = me?.role === "admin"

  React.useEffect(() => {
    setName(user?.name ?? "")
    setRole((user?.role as Role) ?? "student")
    setBio(user?.bio ?? "")
  }, [user])

  async function handleSave() {
    if (!user) return
    try {
      if (mode === "disable") {
        await service.updateUserById(user.id, { disabled: true })
      } else {
        await service.updateUserById(user.id, { name, role, bio })
      }
      toast({ title: "Saved", description: "User updated successfully" })
      onSaved()
      onClose()
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Failed to update user", variant: "destructive" })
    }
  }

  const readOnly = mode === "view" || !canAdmin

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" && "View User"}
            {mode === "edit" && "Edit User"}
            {mode === "disable" && "Disable User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "disable" ? "Are you sure you want to disable this user?" : "Update account details."}
          </DialogDescription>
        </DialogHeader>

        {mode === "disable" ? (
          <div className="text-sm">This action will mark the user as disabled.</div>
        ) : (
          <div className="grid gap-3">
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} readOnly={readOnly} />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Role</label>
              <RoleSelect value={role} onChange={(r) => setRole(r as Role)} />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} readOnly={readOnly} rows={3} />
            </div>
          </div>
        )}

        <DialogFooter className="mt-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {canAdmin && mode !== "view" && <Button onClick={handleSave}>{mode === "edit" ? "Save" : "Disable"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
