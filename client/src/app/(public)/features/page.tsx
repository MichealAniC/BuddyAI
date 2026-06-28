'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import {
  Smile,
  ClipboardCheck,
  BarChart3,
  Users,
  MessageCircle,
  ShieldCheck,
  Bell,
  Calendar,
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

const capabilities = [
  {
    icon: Smile,
    title: 'Daily Mood Tracking',
    description:
      'Log your mood in seconds with an intuitive, judgement-free interface. Spot trends and triggers over time with gentle visualisations.',
    accent: 'primary' as const,
  },
  {
    icon: ClipboardCheck,
    title: 'PHQ-9 & GAD-7 Assessments',
    description:
      'Complete clinically-validated depression and anxiety screenings at your own pace. Results are private and easy to share with support teams.',
    accent: 'sage' as const,
  },
  {
    icon: BarChart3,
    title: 'Personal Analytics',
    description:
      'See your wellbeing journey through clean charts and summaries. Track progress, celebrate wins, and identify when to reach out.',
    accent: 'primary' as const,
  },
  {
    icon: Users,
    title: 'Counsellor Dashboard',
    description:
      'University counsellors get a secure, real-time overview of student risk and caseloads so they can prioritise care effectively.',
    accent: 'rose' as const,
  },
  {
    icon: MessageCircle,
    title: 'Gentle AI Companion',
    description:
      'Chat with Buddy, an ethical, human-in-the-loop AI that offers coping suggestions, encouragement, and crisis escalation when needed.',
    accent: 'sage' as const,
  },
  {
    icon: Bell,
    title: 'Smart Risk Alerts',
    description:
      'Automated alerts help counsellors identify students who may need support, ensuring no one falls through the cracks.',
    accent: 'rose' as const,
  },
  {
    icon: Calendar,
    title: 'Follow-up Scheduling',
    description:
      'Book and manage follow-up sessions directly within the platform, keeping care coordinated and continuous.',
    accent: 'primary' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Privacy-First Architecture',
    description:
      'End-to-end encryption, pseudonymisation, and strict access controls keep student data safe and compliant.',
    accent: 'sage' as const,
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-surface to-surface" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text leading-[1.1]">
                Platform <span className="text-primary-600">Capabilities</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-5 text-lg text-text-muted leading-relaxed">
                A complete wellbeing toolkit for students and university counselling teams — built
                with clinical rigour, ethical AI, and privacy at its core.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Capability grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <FadeIn key={capability.title} delay={0.1 + index * 0.06}>
                  <SanctuaryCard
                    variant={
                      capability.accent === 'sage'
                        ? 'sage'
                        : capability.accent === 'rose'
                        ? 'default'
                        : 'primary'
                    }
                    className="p-6 h-full"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-elevated shadow-card">
                        <Icon
                          className={`h-5 w-5 ${
                            capability.accent === 'sage'
                              ? 'text-sage-600'
                              : capability.accent === 'rose'
                              ? 'text-rose-600'
                              : 'text-primary-600'
                          }`}
                        />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-text">{capability.title}</h3>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed flex-1">
                        {capability.description}
                      </p>
                    </div>
                  </SanctuaryCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* For students vs counsellors */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-surface via-primary-50/30 to-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text">
                Built for every role
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                Whether you are seeking support or providing it, BuddyAI adapts to your needs.
              </p>
            </FadeIn>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <FadeIn delay={0.15}>
              <SanctuaryCard variant="primary" className="p-8 h-full">
                <h3 className="text-xl font-semibold text-text">For Students</h3>
                <ul className="mt-5 space-y-3 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                    Track mood and complete assessments privately
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                    Chat with Buddy for 24/7 gentle support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                    Receive personalised insights and coping tips
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                    Connect with university counsellors when needed
                  </li>
                </ul>
              </SanctuaryCard>
            </FadeIn>

            <FadeIn delay={0.2}>
              <SanctuaryCard variant="sage" className="p-8 h-full">
                <h3 className="text-xl font-semibold text-text">For Counsellors</h3>
                <ul className="mt-5 space-y-3 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0" />
                    See real-time caseload and risk dashboards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0" />
                    Receive alerts for students needing intervention
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0" />
                    Schedule follow-ups and document notes securely
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0" />
                    Make data-informed decisions with population analytics
                  </li>
                </ul>
              </SanctuaryCard>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
