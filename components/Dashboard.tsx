'use client';

import { useMemo } from 'react';
import StatCard from './StatCard';
import GrinderPerformanceChart from './charts/GrinderPerformanceChart';
import ShotTypeChart from './charts/ShotTypeChart';
import ExtractionTimeChart from './charts/ExtractionTimeChart';
import RatioAnalysisChart from './charts/RatioAnalysisChart';
import { useData } from '@/lib/dataContext';
import { mockDashboardStats, calculateAverageRating, calculateAverageRatio } from '@/lib/mockData';
import { 
  TbCoffee, 
  TbStar, 
  TbScale, 
  TbHeart, 
  TbClock,
  TbChartBar 
} from 'react-icons/tb';

export default function Dashboard() {
  const { shots } = useData();
  
  const dashboardStats = useMemo(() => {
    if (shots.length === 0) {
      return {
        totalShots: 0,
        averageRating: 0,
        averageRatio: 0,
        favoriteRoaster: 'N/A',
        averageGrindTime: 0
      };
    }

    const totalShots = shots.length;
    const averageRating = calculateAverageRating(shots);
    const averageRatio = calculateAverageRatio(shots);
    
    // Find favorite roaster (most frequent)
    const roasterCounts = shots.reduce((acc, shot) => {
      acc[shot.roasterName] = (acc[shot.roasterName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteRoaster = Object.entries(roasterCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    
    // Calculate average grind time
    const totalGrindTime = shots.reduce((sum, shot) => sum + (shot.grindTime || 15), 0);
    const averageGrindTime = Math.round((totalGrindTime / totalShots) * 10) / 10;

    return {
      totalShots,
      averageRating,
      averageRatio,
      favoriteRoaster,
      averageGrindTime
    };
  }, [shots]);

  return (
    <div className="max-w-[1344px] mx-auto px-8 py-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="xl:col-span-2">
          <StatCard
            title="Total Shots"
            value={dashboardStats.totalShots}
            icon={<TbCoffee strokeWidth={1.17} />}
            className="h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Average Rating"
            value={`${dashboardStats.averageRating}/10`}
            icon={<TbStar strokeWidth={1.17} />}
            className="h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Average Ratio"
            value={`1:${dashboardStats.averageRatio}`}
            subtitle="Target: 1:2.0"
            icon={<TbScale strokeWidth={1.17} />}
            className="h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Favorite Roaster"
            value={dashboardStats.favoriteRoaster}
            icon={<TbHeart strokeWidth={1.17} />}
            className="h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Avg Grind Time"
            value={`${dashboardStats.averageGrindTime}s`}
            subtitle="Per shot"
            icon={<TbClock strokeWidth={1.17} />}
            className="h-[131.5px]"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-[12.75px] p-6 h-[384px]">
          <div className="flex items-center gap-3 mb-6">
            <TbChartBar className="w-3.5 h-3.5 text-gray-900" strokeWidth={1.17} />
            <h3 className="text-[13px] font-normal text-gray-900 leading-[14px]">
              Grinder Setting Performance
            </h3>
          </div>
          <GrinderPerformanceChart />
        </div>

        <div className="bg-white border border-gray-200 rounded-[12.75px] p-6 h-[384px]">
          <h3 className="text-[13px] font-normal text-gray-900 leading-[14px] mb-6">
            Shot Type Distribution
          </h3>
          <ShotTypeChart />
        </div>

        <div className="bg-white border border-gray-200 rounded-[12.75px] p-6 h-[384px]">
          <div className="flex items-center gap-3 mb-6">
            <TbChartBar className="w-3.5 h-3.5 text-gray-900" strokeWidth={1.17} />
            <h3 className="text-[13px] font-normal text-gray-900 leading-[14px]">
              Extraction Time vs Quality
            </h3>
          </div>
          <ExtractionTimeChart />
        </div>

        <div className="bg-white border border-gray-200 rounded-[12.75px] p-6 h-[384px]">
          <h3 className="text-[13px] font-normal text-gray-900 leading-[14px] mb-6">
            Extraction Ratio Analysis
          </h3>
          <RatioAnalysisChart />
        </div>
      </div>

      {/* Top Performing Roasts Section */}
      <div className="mt-8">
        <div className="bg-white border border-gray-200 rounded-[12.75px] p-6">
          <h3 className="text-[13px] font-normal text-gray-900 leading-[14px] mb-6">
            Top Performing Roasts
          </h3>
          <div className="space-y-4">
            {/* Placeholder for roast cards */}
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900">Black Cat Classic</div>
              <div className="text-sm text-gray-500">Intelligentsia</div>
              <div className="text-xs text-gray-500 mt-1">
                1 shot • Best grinder setting: 11 • Avg ratio: 1:1.9
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900">Bella Donovan</div>
              <div className="text-sm text-gray-500">Blue Bottle Coffee</div>
              <div className="text-xs text-gray-500 mt-1">
                1 shot • Best grinder setting: 12 • Avg ratio: 1:2.0
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900">Hair Bender</div>
              <div className="text-sm text-gray-500">Stumptown Coffee</div>
              <div className="text-xs text-gray-500 mt-1">
                1 shot • Best grinder setting: 14 • Avg ratio: 1:2.1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}