'use client';

import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { mockExtractionTimeData } from '@/lib/mockData';

export default function ExtractionTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={mockExtractionTimeData}>
        <XAxis 
          type="number"
          dataKey="time" 
          domain={[20, 36]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          name="Extraction Time (s)"
        />
        <YAxis 
          type="number"
          dataKey="rating"
          domain={[0, 10]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          name="Rating"
        />
        <Scatter 
          fill="#3B82F6"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}