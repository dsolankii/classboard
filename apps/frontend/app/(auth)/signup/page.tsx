"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { service } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Page() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null);
    setLoading(true);
    try {
      const { name, email, password } = values;
      // public signup -> always student (backend also enforces this)
      await service.register({ name, email, password, role: "student" });

      // register route sets httpOnly cookie, so you're logged in now:
      router.replace("/dashboard");
    } catch (e: any) {
      setError(e?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border shadow-sm p-6 bg-background">
          <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
          <p className="text-muted-foreground mb-4">Join Classboard</p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Signup failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" {...form.register("name")} />
              <FormError error={form.formState.errors.name?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
              <FormError error={form.formState.errors.email?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              <FormError error={form.formState.errors.password?.message} />
            </div>

            <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" disabled className="w-full">Google</Button>
              <Button type="button" variant="outline" disabled className="w-full">GitHub</Button>
            </div>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="underline">Sign in</Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-sm text-red-600">{error}</p>;
}
