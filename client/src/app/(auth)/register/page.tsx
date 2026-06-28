'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Role } from '@/types';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const isStudent = role === 'STUDENT';

  const validate = (): boolean => {
    if (!fullName.trim()) {
      showToast('Please enter your full name.', 'warning');
      return false;
    }
    if (!email.trim()) {
      showToast('Please enter your email address.', 'warning');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return false;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return false;
    }
    if (isStudent) {
      if (!gender) {
        showToast('Please select your gender.', 'warning');
        return false;
      }
      const ageNum = Number(age);
      if (!age || !Number.isInteger(ageNum) || ageNum < 12 || ageNum > 100) {
        showToast('Age must be a whole number between 12 and 100.', 'warning');
        return false;
      }
    }
    return true;
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'COUNSELLOR') {
      setAge('');
      setGender('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(
        fullName,
        email,
        password,
        role,
        isStudent ? Number(age) : undefined,
        isStudent ? gender : undefined
      );
      router.push('/');
    } catch (error: any) {
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SanctuaryCard className="p-8 sm:p-10">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-text">Create your account</h1>
        <p className="mt-1 text-sm text-text-muted">Join BuddyAI for personalized wellness support</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>
        {isStudent && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={12}
                max={100}
                placeholder="e.g. 21"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                disabled={isSubmitting}
                className={cn(
                  'w-full h-10 px-3 rounded-button border bg-surface-elevated text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400',
                  'border-border text-text'
                )}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label>I am a</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleChange('STUDENT')}
              className={cn(
                'px-4 py-2.5 rounded-button text-sm font-medium border transition-all duration-200',
                role === 'STUDENT'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-surface-secondary border-border text-text-muted hover:bg-surface-elevated'
              )}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('COUNSELLOR')}
              className={cn(
                'px-4 py-2.5 rounded-button text-sm font-medium border transition-all duration-200',
                role === 'COUNSELLOR'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-surface-secondary border-border text-text-muted hover:bg-surface-elevated'
              )}
            >
              Counsellor
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className="text-sm text-text-muted text-center pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </SanctuaryCard>
  );
}
