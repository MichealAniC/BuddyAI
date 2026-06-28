'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import {
  UserPlus,
  ClipboardList,
  Smile,
  BrainCircuit,
  Bell,
  Users,
  CalendarCheck,
  ShieldCheck,
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

const lifecycleSteps = [
  {
    icon: UserPlus,
    title: 'Registration',
    description:
      'Students create a secure, university-verified account in under a minute. No credit card, no pressure.',
    accent: 'primary' as const,
  },
  {
    icon: ClipboardList,
    title: 'Baseline Assessment',
    description:
      'Complete validated PHQ-9 and GAD-7 screenings to establish a private wellbeing baseline.',
    accent: 'sage' as const,
  },
  {
    icon: Smile,
    title: 'Daily Check-ins',
    description:
      'Log mood, sleep, and stress levels in seconds. BuddyAI turns these into clear, personal insights.',
    accent: 'primary' as const,
  },
  {
    icon: BrainCircuit,
    title: 'AI Companion Support',
    description:
      'Chat with Buddy for in-the-moment coping strategies, encouragement, and guided reflection.',
    accent: 'sage' as const,
  },
  {
    icon: Bell,
    title: 'Risk Detection',
    description:
      'Pattern analysis and clinical thresholds surface students who may benefit from professional support.',
    accent: 'rose' as const,
  },
  {
    icon: Users,
    title: 'Counsellor Review',
    description:
      'Counsellors receive secure alerts, review context, and decide on the right level of intervention.',
    accent: 'rose' as const,
  },
  {
    icon: CalendarCheck,
    title: 'Intervention & Follow-up',
    description:
      'Students access timely support, sessions are scheduled, and progress is tracked over time.',
    accent: 'primary' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & Continuity',
    description:
      'Every interaction is encrypted and documented securely, ensuring continuous, confidential care.',
    accent: 'sage' as const,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-surface to-surface" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text leading-[1.1]">
                How <span className="text-primary-600">BuddyAI Works</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-5 text-lg text-text-muted leading-relaxed">
                From the first sign-up to ongoing care, BuddyAI creates a seamless, safe journey
                for students and counselling teams.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-10 md:space-y-16">
              {lifecycleSteps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <FadeIn key={step.title} delay={0.1 + index * 0.08}>
                    <div
                      className={`relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 ${
                        isEven ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Content card */}
                      <div className="flex-1">
                        <SanctuaryCard
                          variant={
                            step.accent === 'sage'
                              ? 'sage'
                              : step.accent === 'rose'
                              ? 'default'
                              : 'primary'
                          }
                          className="p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-elevated shadow-card">
                              <Icon
                                className={`h-5 w-5 ${
                                  step.accent === 'sage'
                                    ? 'text-sage-600'
                                    : step.accent === 'rose'
                                    ? 'text-rose-600'
                                    : 'text-primary-600'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-primary-600">
                                  Step {String(index + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <h3 className="mt-1 text-lg font-semibold text-text">{step.title}</h3>
                              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </SanctuaryCard>
                      </div>

                      {/* Center node */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center rounded-full bg-surface-elevated border-2 border-primary-200 shadow-elevated z-10">
                        <span className="text-xs font-semibold text-primary-700">
                          {index + 1}
                        </span>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Journey summary */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-surface via-primary-50/30 to-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
                A continuous circle of care
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                BuddyAI is not a one-time tool. It is a living system that learns, adapts, and
                connects students with the right support at the right time — while keeping privacy
                at the centre of every decision.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
