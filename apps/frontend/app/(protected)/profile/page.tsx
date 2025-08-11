"use client"

import React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AvatarUpload } from "@/components/avatar-upload"
import { AuthContext } from "@/components/protected-layout"
import { service } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const passwordSchema = z
  .object({
    current: z.string().min(8, "Current password required"),
    new: z.string().min(8, "New password must be at least 8 characters"),
    confirm: z.string().min(8, "Confirm your new password"),
  })
  .refine((vals) => vals.new === vals.confirm, { message: "Passwords do not match", path: ["confirm"] })

export default function Page() {
  const { user, setUser } = React.useContext(AuthContext)
  const { toast } = useToast()
  const [saving, setSaving] = React.useState(false)
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(user?.avatarUrl)

  const form = useForm<{ name: string; email: string; role: string; bio: string }>({
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", role: user?.role ?? "", bio: user?.bio ?? "" },
  })

  React.useEffect(() => {
    form.reset({ name: user?.name ?? "", email: user?.email ?? "", role: user?.role ?? "", bio: user?.bio ?? "" })
    setAvatarUrl(user?.avatarUrl)
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSave() {
    setSaving(true)
    const prev = user
    const patch = { name: form.getValues("name"), bio: form.getValues("bio"), avatarUrl }
    try {
      setUser({ ...user, ...patch })
      const updated = await service.updateMe(patch)
      setUser(updated)
      toast({ title: "Saved", description: "Profile updated" })
    } catch (e: any) {
      setUser(prev)
      toast({ title: "Failed to save", description: e?.message ?? "Try again", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const passForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema), defaultValues: { current: "", new: "", confirm: "" } })

  function onChangePassword(values: z.infer<typeof passwordSchema>) {
    // No real backend; simulate delay and success
    setTimeout(() => {
      passForm.reset()
      toast({ title: "Password changed (mock)", description: "Your password has been updated" })
    }, 500)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AvatarUpload url={avatarUrl} onChange={setAvatarUrl} />
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" readOnly disabled {...form.register("email")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" readOnly disabled value={user?.role ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} {...form.register("bio")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onSave} disabled={saving} aria-busy={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={passForm.handleSubmit(onChangePassword)}
          >
            <div className="grid gap-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" {...passForm.register("current")} />
              <FormError errors={passForm.formState.errors.current?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" {...passForm.register("new")} />
              <FormError errors={passForm.formState.errors.new?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type="password" {...passForm.register("confirm")} />
              <FormError errors={passForm.formState.errors.confirm?.message} />
            </div>
            <Button type="submit">Change password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function FormError({ errors }: { errors?: string }) {
  if (!errors) return null
  return <p className="text-sm text-red-600">{errors}</p>
}
