'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { mockGrinderPerformanceData } from '@/lib/mockData';

export default function GrinderPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={mockGrinderPerformanceData}>
        <XAxis 
          dataKey="setting" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis 
          domain={[0, 10]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <Bar 
          dataKey="rating" 
          fill="#3B82F6" 
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}