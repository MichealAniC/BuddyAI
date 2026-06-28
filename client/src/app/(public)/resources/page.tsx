'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Wind,
  Moon,
  HeartPulse,
  Phone,
  Globe,
  BookOpen,
  Headphones,
  ArrowRight,
  ExternalLink,
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

const resourceCategories = [
  {
    title: 'Stress Management',
    description: 'Practical techniques to calm your mind during busy or overwhelming moments.',
    resources: [
      {
        icon: Wind,
        title: 'Guided Breathing',
        excerpt: 'A 4-7-8 breathing exercise you can do anywhere in under two minutes.',
      },
      {
        icon: Moon,
        title: 'Sleep Hygiene Checklist',
        excerpt: 'Evidence-based habits to improve sleep quality and mental clarity.',
      },
      {
        icon: Brain,
        title: 'Cognitive Reframing',
        excerpt: 'Learn to challenge unhelpful thoughts and build a balanced perspective.',
      },
    ],
    accent: 'primary' as const,
  },
  {
    title: 'Mental Health Articles',
    description: 'Curated reading on anxiety, depression, burnout, and student wellbeing.',
    resources: [
      {
        icon: BookOpen,
        title: 'Understanding Anxiety',
        excerpt: 'What anxiety feels like, why it happens, and how to manage it compassionately.',
      },
      {
        icon: HeartPulse,
        title: 'Spotting Burnout Early',
        excerpt: 'Recognise the warning signs before they impact your studies and health.',
      },
      {
        icon: Headphones,
        title: 'The Power of Talking',
        excerpt: 'Why sharing how you feel — with a friend, counsellor, or AI — can help.',
      },
    ],
    accent: 'sage' as const,
  },
  {
    title: 'Emergency Support',
    description: 'If you or someone you know is in crisis, these services are available 24/7.',
    resources: [
      {
        icon: Phone,
        title: 'Crisis Helpline',
        excerpt: 'Free, confidential support from trained professionals at any time.',
      },
      {
        icon: Globe,
        title: 'Find Local Support',
        excerpt: 'Locate mental health services and counsellors near your university.',
      },
      {
        icon: HeartPulse,
        title: 'Emergency Guidance',
        excerpt: 'Clear steps to take if you need urgent help right now.',
      },
    ],
    accent: 'rose' as const,
  },
];

const quickLinks = [
  { label: 'University Counselling', href: '/register' },
  { label: 'Crisis Resources', href: '/resources' },
  { label: 'About BuddyAI', href: '/about' },
  { label: 'Contact Us', href: '/about' },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-surface to-surface" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text leading-[1.1]">
                Wellbeing <span className="text-primary-600">Resources</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-5 text-lg text-text-muted leading-relaxed">
                A curated collection of tools, articles, and emergency contacts to support your
                mental health journey.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Resource categories */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {resourceCategories.map((category, categoryIndex) => (
              <FadeIn key={category.title} delay={0.1 + categoryIndex * 0.12}>
                <div className="h-full">
                  <div className="mb-5">
                    <h2 className="text-2xl font-semibold text-text">{category.title}</h2>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {category.resources.map((resource) => {
                      const Icon = resource.icon;
                      return (
                        <SanctuaryCard
                          key={resource.title}
                          variant={
                            category.accent === 'sage'
                              ? 'sage'
                              : category.accent === 'rose'
                              ? 'default'
                              : 'primary'
                          }
                          className="p-5"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated shadow-card">
                              <Icon
                                className={`h-5 w-5 ${
                                  category.accent === 'sage'
                                    ? 'text-sage-600'
                                    : category.accent === 'rose'
                                    ? 'text-rose-600'
                                    : 'text-primary-600'
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-text">{resource.title}</h3>
                              <p className="mt-1 text-xs text-text-muted leading-relaxed">
                                {resource.excerpt}
                              </p>
                            </div>
                          </div>
                        </SanctuaryCard>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-surface via-primary-50/30 to-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
                Not sure where to start?
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 text-text-muted leading-relaxed">
                Create your free BuddyAI account to receive personalised recommendations based on
                your goals and wellbeing profile.
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
                  <Link href="/about">
                    Learn About BuddyAI
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
