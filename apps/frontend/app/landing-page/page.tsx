"use client"

import type React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  LayoutDashboard,
  ListChecks,
  Shield,
  Sparkles,
  Users,
  Settings,
  ChevronRight,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="relative w-full px-6 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                <span>Introducing Classboard</span>
              </div>

              <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                Run your{" "}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  classes calmly
                </span>
              </h1>
              <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
                Clear roles. Fast search. Focused UI. A dashboard that looks great and stays out of your way.
              </p>

              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Log in
                  </Button>
                </Link>
              </div>

              {/* Quick points */}
              <ul className="mt-6 grid max-w-xl grid-cols-1 gap-2 text-left text-sm text-muted-foreground sm:grid-cols-3">
                <HeroPoint>Role-based access</HeroPoint>
                <HeroPoint>Dark mode</HeroPoint>
                <HeroPoint>Fast filters</HeroPoint>
              </ul>

              {/* Trusted row */}
            </div>

            {/* Right: Aesthetic preview */}
            <div className="relative mx-auto w-full max-w-xl">
              <PreviewDeck />
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="w-full px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need, designed beautifully
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              A thoughtful toolkit for admins, teachers, and students — without visual noise.
            </p>
          </header>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Role management"
              desc="Assign roles with clarity and keep controls obvious."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Protected routes"
              desc="Sensible permissions built-in for secure access."
            />
            <FeatureCard
              icon={<LayoutDashboard className="h-5 w-5" />}
              title="Clean UI"
              desc="Notion‑style layout that elevates your content."
            />
            <FeatureCard
              icon={<Search className="h-5 w-5" />}
              title="Search & filter"
              desc="Find people quickly by name, email, and more."
            />
            <FeatureCard
              icon={<ListChecks className="h-5 w-5" />}
              title="Bulk actions"
              desc="Admin-only actions like add, disable/enable users."
            />
            <FeatureCard
              icon={<Settings className="h-5 w-5" />}
              title="Preferences"
              desc="Theme and density controls that feel just right."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="w-full px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get up and running in minutes</h2>
            <p className="mt-3 text-base text-muted-foreground">A simple 3-step path — no complicated setup.</p>
          </header>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <StepCard number="1" title="Create your account" desc="Sign up and choose your role." />
            <StepCard number="2" title="Invite your team" desc="Add teachers and students securely." />
            <StepCard number="3" title="Manage and grow" desc="Track signups and keep everything tidy." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-base text-muted-foreground">Start free. Upgrade when you’re ready.</p>
          </header>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            <PricingCard
              label="Free"
              price="$0"
              per="/mo"
              features={["1 admin", "Up to 2 teachers", "100 students", "Basic analytics"]}
              cta={{ text: "Get started", href: "/signup", variant: "outline" }}
            />
            <PricingCard
              label="Pro"
              price="$19"
              per="/mo"
              highlight
              features={[
                "Up to 5 admins",
                "Unlimited teachers",
                "5,000 students",
                "Advanced analytics",
                "Priority support",
              ]}
              cta={{ text: "Start Pro", href: "/signup" }}
            />
            <PricingCard
              label="Organization"
              price="$49"
              per="/mo"
              features={["Unlimited everything", "SAML SSO", "Audit logs", "Dedicated support"]}
              cta={{ text: "Start Organization", href: "/signup" }}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="w-full px-6 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-base text-muted-foreground">Quick answers to help you decide.</p>
          </header>

          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible>
              <AccordionItem value="f1">
                <AccordionTrigger>Is there a free plan?</AccordionTrigger>
                <AccordionContent>Yes. You can start on Free and upgrade anytime.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="f2">
                <AccordionTrigger>Do you support dark mode?</AccordionTrigger>
                <AccordionContent>Yes. Toggle it from the navbar; it applies site‑wide.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="f3">
                <AccordionTrigger>Who can add or disable users?</AccordionTrigger>
                <AccordionContent>Admins only. Teachers and students have limited access.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="f4">
                <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
                <AccordionContent>Absolutely. You can cancel or switch plans at any time.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="f5">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>Yes. Role‑based access and protected routes are built‑in.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full px-6 pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border bg-card/60 p-6 sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold sm:text-2xl">Ready to try a calmer dashboard?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your workspace in minutes. No credit card required.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Start free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

/* Header/Nav (full-width with balanced padding; includes Pricing and FAQ) */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <Link href="/landing-page" className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/10">
            <span className="text-[11px] font-bold">CB</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Classboard</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="gap-1.5">
              Sign up
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

/* Decorative hero backdrop */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 20%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* gradient orbs */}
      <div
        className="absolute left-[-10%] top-[-20%] h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl dark:opacity-15"
        style={{ background: "radial-gradient(closest-side, hsl(160 70% 65% / 0.45), transparent)" }}
      />
      <div
        className="absolute right-[-10%] top-[10%] h-[32rem] w-[32rem] rounded-full opacity-15 blur-3xl dark:opacity-10"
        style={{ background: "radial-gradient(closest-side, hsl(200 85% 60% / 0.4), transparent)" }}
      />
    </div>
  )
}

/* A gradient-glass deck that suggests analytics without images */
function PreviewDeck() {
  return (
    <div className="relative h-[420px] w-full">
      {/* Base card */}
      <div className="absolute left-1/2 top-1/2 z-[1] w-[85%] -translate-x-1/2 -translate-y-1/2 rotate-0">
        <GlassCard>
          <HeaderLine />
          <MiniChart />
          <KpiRow />
        </GlassCard>
      </div>
      {/* Back card L */}
      <div className="absolute left-[15%] top-[16%] z-0 w-[55%] -rotate-6">
        <GlassCard muted>
          <BarBlocks />
        </GlassCard>
      </div>
      {/* Back card R */}
      <div className="absolute right-[12%] bottom-[8%] z-0 w-[48%] rotate-6">
        <GlassCard muted>
          <ListBlocks />
        </GlassCard>
      </div>
    </div>
  )
}

function GlassCard({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div
      className={[
        "rounded-xl border p-4 shadow-sm",
        "bg-white/70 backdrop-blur dark:bg-neutral-900/50",
        muted ? "opacity-80" : "",
        "ring-1 ring-inset ring-primary/10",
        "relative",
      ].join(" ")}
      style={{
        boxShadow: "0 4px 30px hsl(0 0% 0% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl"
        style={{
          background:
            "linear-gradient(180deg, hsl(160 70% 60% / 0.12), transparent), radial-gradient(60% 60% at 10% 0%, hsl(200 85% 60% / 0.10), transparent)",
        }}
      />
      {children}
    </div>
  )
}

function HeaderLine() {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="inline-flex items-center gap-2">
        <div className="h-5 w-5 rounded-md border bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
      <div className="inline-flex items-center gap-2">
        <div className="h-6 w-16 rounded bg-muted" />
        <div className="h-6 w-10 rounded bg-muted" />
      </div>
    </div>
  )
}
function MiniChart() {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-md border bg-card">
      <div className="absolute inset-0 opacity-[0.12]">
        <PatternDots />
      </div>
      {/* simple area-ish shape */}
      <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-emerald-500/25 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute bottom-[22%] left-[5%] h-[2px] w-[18%] bg-emerald-500/70" />
        <div className="absolute bottom-[32%] left-[23%] h-[2px] w-[14%] bg-emerald-500/70" />
        <div className="absolute bottom-[18%] left-[39%] h-[2px] w-[22%] bg-emerald-500/70" />
        <div className="absolute bottom-[42%] left-[63%] h-[2px] w-[16%] bg-emerald-500/70" />
      </div>
    </div>
  )
}
function KpiRow() {
  return (
    <div className="mt-3 grid grid-cols-3 gap-3">
      {["Users", "Teachers", "Students"].map((t, i) => (
        <div key={t} className="rounded-md border p-2">
          <div className="text-[11px] text-muted-foreground">{t}</div>
          <div className="mt-1 text-sm font-semibold tabular-nums">{[1280, 320, 960][i]?.toLocaleString?.()}</div>
        </div>
      ))}
    </div>
  )
}
function BarBlocks() {
  return (
    <div className="grid grid-cols-6 items-end gap-1 py-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded bg-emerald-500/30" style={{ height: `${Math.max(12, (i * 13) % 64)}px` }} />
      ))}
    </div>
  )
}
function ListBlocks() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md border bg-muted" />
          <div className="h-3 w-40 flex-1 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
function PatternDots() {
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 20%, transparent) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
  )
}

function HeroPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-emerald-500" />
      <span>{children}</span>
    </li>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="group rounded-xl border bg-card/60 p-5 transition-transform hover:-translate-y-0.5 hover:bg-card/70">
      <div className="flex items-start gap-3">
        <div className="rounded-md border bg-muted/60 p-2 text-emerald-600 dark:text-emerald-400">{icon}</div>
        <div>
          <div className="text-base font-medium">{title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  )
}
function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card/60 p-6">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
        {number}
      </div>
      <div className="text-base font-medium">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function PricingCard({
  label,
  price,
  per,
  features,
  cta,
  highlight,
}: {
  label: string
  price: string
  per: string
  features: string[]
  cta: { text: string; href: string; variant?: "default" | "outline" }
  highlight?: boolean
}) {
  return (
    <div
      className={[
        "relative rounded-xl border bg-card/60 p-6",
        highlight ? "ring-2 ring-emerald-500" : "",
        "hover:bg-card/70",
      ].join(" ")}
    >
      {highlight ? (
        <div className="absolute -top-3 right-4 rounded-full border bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
          Most popular
        </div>
      ) : null}
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className="text-3xl font-semibold">{price}</div>
        <div className="text-sm text-muted-foreground">{per}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link href={cta.href} className="mt-5 block">
        <Button className="w-full" variant={cta.variant || "default"}>
          {cta.text}
        </Button>
      </Link>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted-foreground sm:flex-row">
        <div>© {new Date().getFullYear()} Classboard. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  )
}
