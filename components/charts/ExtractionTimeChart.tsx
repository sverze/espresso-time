'use client';

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/dataContext';
import { calculateExtractionTimeData } from '@/lib/dashboardCalculations';

export default function ExtractionTimeChart() {
  const { shots } = useData();
  
  const extractionData = useMemo(() => calculateExtractionTimeData(shots), [shots]);

  if (extractionData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <div className="text-center">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Add espresso shots to see extraction time analysis</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic domains based on actual data
  const timeValues = extractionData.map(d => d.time);
  const minTime = Math.max(Math.min(...timeValues) - 2, 0);
  const maxTime = Math.max(...timeValues) + 2;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={extractionData}>
        <XAxis 
          type="number"
          dataKey="time" 
          domain={[minTime, maxTime]}
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