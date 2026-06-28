'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import {
  Smile,
  ClipboardCheck,
  Users,
  ShieldCheck,
  Lock,
  BrainCircuit,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

/* --------------------------------------------------------------------------
 * Reusable fade-in-up animation wrapper
 * -------------------------------------------------------------------------- */
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------------------
 * Abstract UI illustration for the hero section
 * -------------------------------------------------------------------------- */
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none">
      <div className="relative rounded-sanctuary bg-surface-elevated shadow-sanctuary border border-border/60 p-6 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-sage-100/60 blur-3xl" />

        {/* Mock header */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Smile className="w-4 h-4 text-primary-600" />
            </div>
            <div className="h-2.5 w-20 rounded-full bg-surface-secondary" />
          </div>
          <div className="h-8 w-8 rounded-full bg-surface-secondary" />
        </div>

        {/* Mock mood card */}
        <div className="relative rounded-card bg-primary-50/60 border border-primary-100 p-4 mb-4">
          <p className="text-xs font-medium text-primary-700">Today&apos;s check-in</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Feeling calm</p>
              <p className="text-xs text-text-muted">Mood logged at 9:00 AM</p>
            </div>
          </div>
        </div>

        {/* Mock assessment card */}
        <div className="relative rounded-card bg-surface-secondary/70 border border-border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text">PHQ-9 Assessment</p>
              <p className="text-xs text-text-muted mt-0.5">Due this week</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-sage-600" />
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-surface-elevated overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-sage-500" />
          </div>
        </div>

        {/* Mock alert / support card */}
        <div className="relative rounded-card bg-rose-50/60 border border-rose-100 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Counsellor connected</p>
              <p className="text-xs text-text-muted mt-0.5">
                Dr. Sarah is available for a check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Data
 * -------------------------------------------------------------------------- */
const features = [
  {
    icon: Smile,
    title: 'Mood Tracking',
    description:
      'Log your daily mood in seconds and spot patterns over time with gentle, visual insights.',
    accent: 'primary' as const,
  },
  {
    icon: ClipboardCheck,
    title: 'Clinical Assessments',
    description:
      'Complete validated PHQ-9 and GAD-7 check-ins to understand your wellbeing with confidence.',
    accent: 'sage' as const,
  },
  {
    icon: Users,
    title: 'Counsellor Support',
    description:
      'Stay connected to your university counselling team through secure alerts and follow-ups.',
    accent: 'rose' as const,
  },
];

const steps = [
  {
    title: 'Register',
    description: 'Create your secure, university-verified account in under a minute.',
  },
  {
    title: 'Assess',
    description: 'Complete clinically-validated assessments at your own pace.',
  },
  {
    title: 'Monitor',
    description: 'Track mood, sleep, and stress trends through your private dashboard.',
  },
  {
    title: 'Intervene',
    description: 'Access timely support from counsellors when you need it most.',
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'Privacy by Design',
    description: 'Your data is encrypted, pseudonymised, and never sold or shared without consent.',
  },
  {
    icon: Lock,
    title: 'University-Grade Security',
    description: 'Built on secure infrastructure with role-based access and audit logging.',
  },
  {
    icon: BrainCircuit,
    title: 'Ethical AI',
    description: 'Our AI is transparent, human-in-the-loop, and designed to augment — not replace — care.',
  },
];

/* --------------------------------------------------------------------------
 * Page
 * -------------------------------------------------------------------------- */
export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    if (user?.role === 'COUNSELLOR') {
      router.replace('/overview');
    } else {
      router.replace('/home');
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-surface to-surface" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <div className="max-w-2xl">
              <FadeIn>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary-700 border border-primary-100">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Trusted by university wellbeing teams
                </span>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text leading-[1.1]">
                  Your Daily Companion for{' '}
                  <span className="text-primary-600">Wellbeing</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-text-muted leading-relaxed max-w-xl">
                  Evidence-based mental health monitoring, designed for university life. Track your
                  mood, complete clinical assessments, and stay connected to support — all in one
                  calm, private space.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Button
                    size="lg"
                    className="bg-primary-600 text-white shadow-sanctuary hover:bg-primary-700 transition-all duration-200 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/register">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto text-text-muted hover:text-text hover:bg-surface-secondary"
                    asChild
                  >
                    <Link href="/#how-it-works">Learn More</Link>
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <p className="mt-6 text-xs text-text-muted">
                  Free for students · No credit card required · End-to-end encrypted
                </p>
              </FadeIn>
            </div>

            {/* Right: abstract UI */}
            <FadeIn delay={0.25} className="order-first lg:order-last">
              <HeroIllustration />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
                Everything you need to feel supported
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                A thoughtfully designed toolkit for mental wellness, built with clinical rigour and
                human warmth.
              </p>
            </FadeIn>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={0.15 + index * 0.1}>
                  <SanctuaryCard
                    variant={feature.accent === 'sage' ? 'sage' : feature.accent === 'rose' ? 'default' : 'primary'}
                    className="p-8 h-full"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-elevated shadow-card">
                        <Icon
                          className={`h-6 w-6 ${
                            feature.accent === 'sage'
                              ? 'text-sage-600'
                              : feature.accent === 'rose'
                              ? 'text-rose-600'
                              : 'text-primary-600'
                          }`}
                        />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-text">{feature.title}</h3>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed flex-1">
                        {feature.description}
                      </p>
                    </div>
                  </SanctuaryCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Stepper */}
      <section
        id="how-it-works"
        className="py-24 lg:py-32 bg-gradient-to-b from-surface via-primary-50/30 to-surface"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
                How it works
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                From registration to intervention, BuddyAI walks with you every step of the way.
              </p>
            </FadeIn>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <FadeIn key={item.title} delay={0.15 + index * 0.12}>
                  <div className="relative">
                    {/* Connector line (desktop) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                    )}

                    <div className="flex flex-col items-center text-center">
                      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated border border-border shadow-elevated">
                        <span className="text-lg font-semibold text-primary-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-text">{item.title}</h3>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed max-w-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
                Your trust is our foundation
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                We combine clinical best practice with robust security and ethical AI to keep you
                safe.
              </p>
            </FadeIn>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.title} delay={0.15 + index * 0.1}>
                  <SanctuaryCard className="p-8 h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-text">{item.title}</h3>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed flex-1">
                        {item.description}
                      </p>
                    </div>
                  </SanctuaryCard>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
                <span>GDPR-aligned data handling</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
                <span>Human-in-the-loop escalation</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
                <span>Regular security audits</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <FadeIn>
            <SanctuaryCard variant="primary" className="p-10 sm:p-14 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-text">
                Start your wellbeing journey today
              </h2>
              <p className="mt-4 text-text-muted leading-relaxed max-w-xl mx-auto">
                Join thousands of students who&apos;ve found a calmer, more supported university
                experience with BuddyAI.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-primary-600 text-white shadow-sanctuary hover:bg-primary-700"
                  asChild
                >
                  <Link href="/register">Create your free account</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border bg-surface-elevated hover:bg-surface-secondary"
                  asChild
                >
                  <Link href="/login">I already have an account</Link>
                </Button>
              </div>
            </SanctuaryCard>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
