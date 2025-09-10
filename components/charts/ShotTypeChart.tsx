'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/dataContext';
import { calculateShotTypeDistribution } from '@/lib/dashboardCalculations';

const COLORS = ['#3B82F6', '#EF4444', '#10B981'];

export default function ShotTypeChart() {
  const { shots } = useData();
  
  const shotTypeData = useMemo(() => calculateShotTypeDistribution(shots), [shots]);

  if (shotTypeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <div className="text-center">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Add espresso shots to see shot type distribution</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={shotTypeData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="count"
        >
          {shotTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}