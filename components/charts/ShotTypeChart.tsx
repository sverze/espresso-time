'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockShotTypeData } from '@/lib/mockData';

const COLORS = ['#3B82F6', '#EF4444', '#10B981'];

export default function ShotTypeChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={mockShotTypeData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="count"
        >
          {mockShotTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}