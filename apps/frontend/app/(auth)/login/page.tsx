"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const registered = search.get("registered") === "true";

  const [error, setError] = React.useState<string | null>(null);
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null);
    setLoading(true);
    try {
      await service.login(values);               // sets httpOnly cookie via our /api route
      router.replace(next);                      // go to dashboard (or ?next=…)
    } catch (e: any) {
      setError(e?.message ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border shadow-sm p-6 bg-background">
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-muted-foreground mb-4">Sign in to Classboard</p>

          {registered && (
            <Alert className="mb-4">
              <AlertTitle>Account created</AlertTitle>
              <AlertDescription>You can sign in now.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Sign in failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email"
                     placeholder="you@example.com" {...form.register("email")} />
              <FormError error={form.formState.errors.email?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" disabled className="w-full">Google</Button>
              <Button type="button" variant="outline" disabled className="w-full">GitHub</Button>
            </div>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            New here?{" "}
            <Link href="/signup" className="underline">Create an account</Link>
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