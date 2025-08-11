"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePreferences } from "@/lib/preferences"

export default function Page() {
  const { theme, setTheme } = useTheme()
  const { density, setDensity } = usePreferences()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select theme" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Density</Label>
            <Select value={density} onValueChange={(v: "comfortable" | "compact") => setDensity(v)}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select density" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Compact reduces paddings about 20%.</p>
          </div>

          <div className="grid gap-2">
            <Label>Language</Label>
            <Select value="en" onValueChange={() => {}}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
