'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Heart, ExternalLink, MessageCircle, Shield, BookOpen } from 'lucide-react';
import Link from 'next/link';

const emergencyContacts = [
  { name: 'National Crisis Hotline', number: '988', description: 'Free 24/7 support for people in distress' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free 24/7 text-based support' },
  { name: 'Campus Counselling', number: 'Contact your institution', description: 'Professional support from your campus' },
];

const resources = [
  { title: 'Breathing Exercises', description: 'Simple techniques to calm your mind', icon: Heart, color: 'bg-pink-50 text-pink-500' },
  { title: 'Mindfulness Guide', description: 'Stay present with guided practices', icon: BookOpen, color: 'bg-purple-50 text-purple-500' },
  { title: 'Sleep Hygiene Tips', description: 'Improve your rest and recovery', icon: Shield, color: 'bg-blue-50 text-blue-500' },
];

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Support</h1>
        <p className="mt-1 text-neutral-500">You're not alone. Help is always available.</p>
      </div>

      {/* Emergency Banner */}
      <Card className="bg-red-50 border-red-100">
        <CardContent className="flex items-start gap-3 py-4">
          <div className="p-2 rounded-xl bg-red-100 shrink-0">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">In immediate danger?</p>
            <p className="text-sm text-red-700 mt-0.5">
              If you or someone you know is in immediate danger, please call emergency services (911) right away.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Talk to Buddy CTA */}
      <Card className="bg-primary-50 border-primary-100">
        <CardContent className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-100">
              <MessageCircle className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-800">Need someone to talk to?</p>
              <p className="text-xs text-primary-600">Buddy is always here to listen, anytime.</p>
            </div>
          </div>
          <Link href="/buddy">
            <Button size="sm">Talk to Buddy</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Helplines */}
      <Card>
        <CardHeader>
          <CardTitle>Crisis Helplines</CardTitle>
          <CardDescription>Confidential support available 24/7</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div key={contact.name} className="flex items-center justify-between py-3 px-4 rounded-[10px] bg-neutral-50">
              <div>
                <p className="text-sm font-medium text-neutral-800">{contact.name}</p>
                <p className="text-xs text-neutral-500">{contact.description}</p>
              </div>
              <span className="text-sm font-semibold text-primary-600">{contact.number}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Coping Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Coping Resources</CardTitle>
          <CardDescription>Tools and techniques for wellbeing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div key={resource.title} className="flex flex-col items-center text-center p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className={`p-2.5 rounded-xl ${resource.color} mb-2`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-neutral-700">{resource.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{resource.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center px-4">
        BuddyAI is not a replacement for professional mental health care. If you're experiencing a mental health emergency, please contact a crisis helpline or go to your nearest emergency room.
      </p>
    </div>
  );
}
