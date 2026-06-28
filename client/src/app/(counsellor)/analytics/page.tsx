'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsReportData } from '@/hooks/useAlerts';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, BarChart3 } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  MINIMAL: '#22c55e',
  MILD: '#3b82f6',
  MODERATE: '#eab308',
  MODERATELY_SEVERE: '#f97316',
  SEVERE: '#ef4444',
};

const STATUS_COLORS: Record<string, string> = {
  'Under Review': '#3b82f6',
  'Follow-up': '#a855f7',
  Resolved: '#22c55e',
};

export default function ReportsPage() {
  const { data, isLoading } = useAnalyticsReportData();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Reports</h1>
        <p className="mt-1 text-neutral-500">Intelligence and trends across the student population.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full lg:col-span-2" />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-primary-500" />
                Risk Distribution
              </CardTitle>
              <CardDescription>Latest PHQ-9 severity levels across students</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskDistributionChart data={data.populationHealth} />
            </CardContent>
          </Card>

          {/* Wellbeing Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                Wellbeing Trend
              </CardTitle>
              <CardDescription>Monthly average PHQ-9 scores</CardDescription>
            </CardHeader>
            <CardContent>
              <WellbeingTrendChart data={data.trendData} />
            </CardContent>
          </Card>

          {/* Case Resolution Velocity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                Case Resolution Velocity
              </CardTitle>
              <CardDescription>Average hours spent in each case stage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResolutionVelocityChart data={data.resolutionVelocity} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-sm text-neutral-400">No report data available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RiskDistributionChart({ data }: { data: { level: string; count: number }[] }) {
  const chartData = data.filter((d) => d.count > 0);

  if (chartData.length === 0) {
    return <EmptyState message="No assessment data recorded yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="level"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        >
          {chartData.map((entry) => (
            <Cell key={entry.level} fill={RISK_COLORS[entry.level] ?? '#94a3b8'} />
          ))}
        </Pie>
        <RechartsTooltip
          contentStyle={{ borderRadius: '10px', border: '1px solid #e7e5e4', fontSize: '12px' }}
          formatter={(value: any, name: any) => {
            const count = Number(value ?? 0);
            return [`${count} student${count === 1 ? '' : 's'}`, String(name ?? '').replace(/_/g, ' ')];
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => value.replace(/_/g, ' ')}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function WellbeingTrendChart({ data }: { data: { month: string; averageScore: number }[] }) {
  if (data.length === 0) {
    return <EmptyState message="No trend data available yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#a8a29e' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 27]}
          tick={{ fontSize: 11, fill: '#a8a29e' }}
          tickLine={false}
          axisLine={false}
        />
        <RechartsTooltip
          contentStyle={{ borderRadius: '10px', border: '1px solid #e7e5e4', fontSize: '12px' }}
          formatter={(value: any) => [`Avg Score: ${Number(value ?? 0)}`, 'PHQ-9']}
        />
        <Line
          type="monotone"
          dataKey="averageScore"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: '#6366f1', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ResolutionVelocityChart({ data }: { data: { status: string; averageHours: number }[] }) {
  const chartData = data.map((d) => ({ ...d, fill: STATUS_COLORS[d.status] ?? '#94a3b8' }));

  if (chartData.every((d) => d.averageHours === 0)) {
    return <EmptyState message="No resolved cases yet to calculate velocity." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 12, fill: '#a8a29e' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#a8a29e' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#a8a29e', fontSize: 11 } }}
        />
        <RechartsTooltip
          contentStyle={{ borderRadius: '10px', border: '1px solid #e7e5e4', fontSize: '12px' }}
          formatter={(value: any) => [`${Number(value ?? 0)} hours`, 'Average Time']}
        />
        <Bar dataKey="averageHours" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[280px] text-sm text-neutral-400">
      {message}
    </div>
  );
}
