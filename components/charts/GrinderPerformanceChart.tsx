'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/dataContext';
import { calculateGrinderPerformance } from '@/lib/dashboardCalculations';

export default function GrinderPerformanceChart() {
  const { shots } = useData();
  
  const grinderData = useMemo(() => calculateGrinderPerformance(shots), [shots]);

  if (grinderData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <div className="text-center">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Add espresso shots to see grinder performance</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={grinderData}>
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