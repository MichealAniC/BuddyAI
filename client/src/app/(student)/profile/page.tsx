'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, LogOut, Shield } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Profile</h1>
        <p className="mt-1 text-neutral-500">Manage your account and preferences.</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 py-2 px-3 rounded-[10px] bg-neutral-50">
            <User className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Full Name</p>
              <p className="text-sm font-medium text-neutral-800">{user?.fullName || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 px-3 rounded-[10px] bg-neutral-50">
            <Mail className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Email</p>
              <p className="text-sm font-medium text-neutral-800">{user?.email || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 px-3 rounded-[10px] bg-neutral-50">
            <Shield className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Role</p>
              <Badge variant="primary">{user?.role || '—'}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 px-3 rounded-[10px] bg-neutral-50">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Member Since</p>
              <p className="text-sm font-medium text-neutral-800">
                {user?.createdAt ? formatDate(user.createdAt) : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Your data is stored securely and is only accessible to you and your assigned counsellor (if applicable). 
            We never share your personal information with third parties.
          </p>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="py-4">
          <Button variant="danger" onClick={logout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
