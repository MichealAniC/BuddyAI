import { PublicNav } from '@/components/layout/PublicNav';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'For Students', href: '/register' },
    { label: 'For Counsellors', href: '/register' },
  ],
  Resources: [
    { label: 'Mental Health Guide', href: '/resources' },
    { label: 'Crisis Support', href: '/resources' },
    { label: 'FAQ', href: '/resources' },
    { label: 'Blog', href: '/resources' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Contact', href: '/about' },
    { label: 'Partners', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Data Security', href: '/security' },
  ],
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/50 bg-surface-elevated/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-lg font-semibold text-text">BuddyAI</p>
              <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-xs">
                Evidence-based mental health monitoring designed for university life. Always here, always private.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-text">{category}</p>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted hover:text-primary-600 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} BuddyAI. All rights reserved.
            </p>
            <p className="text-xs text-text-muted">
              Built for student wellbeing. Powered by ethical AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

