'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MoodEntry } from '@/types';
import { getMoodEmoji } from '@/utils/formatters';

interface MoodChartProps {
  data: MoodEntry[];
}

export function MoodChart({ data }: MoodChartProps) {
  const chartData = [...data]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-30)
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rating: entry.moodRating,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-neutral-400">
        No mood data to display yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#a8a29e' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 11, fill: '#a8a29e' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => getMoodEmoji(v)}
        />
        <Tooltip
          contentStyle={{ borderRadius: '10px', border: '1px solid #e7e5e4', fontSize: '12px' }}
          formatter={(value) => [`${getMoodEmoji(Number(value))} ${value}/5`, 'Mood'] as [string, string]}
        />
        <Area
          type="monotone"
          dataKey="rating"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#moodGradient)"
          dot={{ fill: '#6366f1', r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
