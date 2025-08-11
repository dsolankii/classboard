"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "teacher", "student"]),
  bio: z.string().optional(),
  joined: z.date(),
})

export type AddUserValues = z.infer<typeof schema>

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultDate = new Date(),
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSubmit: (values: AddUserValues) => Promise<void>
  defaultDate?: Date
}) {
  const form = useForm<AddUserValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "student", bio: "", joined: defaultDate },
  })
  const [submitting, setSubmitting] = React.useState(false)

  async function handle() {
    setSubmitting(true)
    try {
      await onSubmit(form.getValues())
      form.reset({ name: "", email: "", role: "student", bio: "", joined: defaultDate })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@example.com" {...form.register("email")} />
          </div>
          <div className="grid gap-1">
            <Label>Role</Label>
            <Select value={form.watch("role")} onValueChange={(v: any) => form.setValue("role", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Joined date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start", !form.watch("joined") && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("joined")?.toISOString().slice(0, 10).replace(/-/g, "/")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("joined")}
                  onSelect={(d) => d && form.setValue("joined", d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Optional" {...form.register("bio")} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handle} disabled={submitting} aria-busy={submitting}>
            {submitting ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
