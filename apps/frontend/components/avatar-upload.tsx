"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AvatarUpload({
  url,
  onChange,
}: {
  url?: string
  onChange: (newUrl?: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState(url)

  return (
    <div className="flex items-center gap-4">
      <Image
        src={preview || "/placeholder.svg?height=64&width=64&query=avatar"}
        alt="Avatar preview"
        width={64}
        height={64}
        className="rounded-full"
      />
      <div className="space-x-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = () => {
                const dataUrl = reader.result as string
                setPreview(dataUrl)
                onChange(dataUrl)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
        {preview ? (
          <Button variant="ghost" onClick={() => { setPreview(undefined); onChange(undefined) }}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  )
}
