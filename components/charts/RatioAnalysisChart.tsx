'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { mockRatioAnalysisData } from '@/lib/mockData';

export default function RatioAnalysisChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={mockRatioAnalysisData}>
        <XAxis 
          dataKey="ratio" 
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
          dataKey="averageRating" 
          fill="#10B981" 
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}