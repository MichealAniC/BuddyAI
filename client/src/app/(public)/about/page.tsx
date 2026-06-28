'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Eye,
  ShieldCheck,
  Cpu,
  Users,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

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
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const storyPillars = [
  {
    icon: Heart,
    title: 'Our Mission',
    body: 'To make compassionate, evidence-based mental health support accessible to every student — whenever and wherever they need it.',
    accent: 'primary' as const,
  },
  {
    icon: Eye,
    title: 'Our Vision',
    body: 'A university experience where no student feels alone with their mental health, and help is always one gentle step away.',
    accent: 'sage' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Commitment',
    body: 'Your data is encrypted end-to-end, stored on secure infrastructure, and never sold. Anonymity options and granular controls put you in full command of your story.',
    accent: 'rose' as const,
  },
  {
    icon: Cpu,
    title: 'Technology Overview',
    body: 'Our AI is shaped by clinical best practices and real-world feedback. It listens first, responds thoughtfully, and always knows when to escalate to a human.',
    accent: 'primary' as const,
  },
];

const values = [
  {
    icon: Users,
    title: 'Human-Centred',
    body: 'Technology should amplify care, not replace it. BuddyAI is designed to work alongside counsellors, friends, and support networks.',
  },
  {
    icon: GraduationCap,
    title: 'Evidence-Based',
    body: 'We integrate validated screening tools and therapeutic frameworks to ensure every interaction is grounded in science.',
  },
  {
    icon: ShieldCheck,
    title: 'Ethical & Transparent',
    body: 'We publish how our AI makes decisions, avoid dark patterns, and prioritise user consent at every turn.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-surface to-surface" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text leading-[1.1]">
                About <span className="text-primary-600">BuddyAI</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-5 text-lg text-text-muted leading-relaxed">
                We believe that asking for help should feel as natural as talking to a trusted
                friend. BuddyAI is built by clinicians, engineers, and designers who share one
                conviction: mental health support should be calm, private, and always available.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Story pillars */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {storyPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <FadeIn key={pillar.title} delay={0.1 + index * 0.08}>
                  <SanctuaryCard
                    variant={
                      pillar.accent === 'sage'
                        ? 'sage'
                        : pillar.accent === 'rose'
                        ? 'default'
                        : 'primary'
                    }
                    className="p-8 h-full"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated shadow-card">
                      <Icon
                        className={`h-5 w-5 ${
                          pillar.accent === 'sage'
                            ? 'text-sage-600'
                            : pillar.accent === 'rose'
                            ? 'text-rose-600'
                            : 'text-primary-600'
                        }`}
                      />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-text">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">{pillar.body}</p>
                  </SanctuaryCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-surface via-primary-50/30 to-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
                What we stand for
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                Our principles guide every product, partnership, and conversation we build.
              </p>
            </FadeIn>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeIn key={value.title} delay={0.15 + index * 0.08}>
                  <SanctuaryCard variant="sage" className="p-6 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated shadow-card">
                      <Icon className="h-5 w-5 text-sage-600" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-text">{value.title}</h3>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">{value.body}</p>
                  </SanctuaryCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical foundations */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
              Built on clinical foundations
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-text-muted leading-relaxed">
              BuddyAI integrates validated screening tools like PHQ-9 and GAD-7, and its
              conversational framework is shaped by cognitive behavioural therapy (CBT) and
              motivational interviewing principles — ensuring every interaction is meaningful, safe,
              and grounded in science.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-surface via-primary-50/30 to-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
              Join the movement
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-text-muted leading-relaxed">
              Be part of a university community that puts student wellbeing first.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-primary-600 text-white shadow-sanctuary hover:bg-primary-700"
                asChild
              >
                <Link href="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border bg-surface-elevated hover:bg-surface-secondary"
                asChild
              >
                <Link href="/resources">Explore Resources</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
