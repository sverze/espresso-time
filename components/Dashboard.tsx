'use client';

import { useMemo } from 'react';
import StatCard from './StatCard';
import GrinderPerformanceChart from './charts/GrinderPerformanceChart';
import ExtractionTimeChart from './charts/ExtractionTimeChart';
import RatioAnalysisChart from './charts/RatioAnalysisChart';
import { useData } from '@/lib/dataContext';
import { calculateDashboardStats, calculateTopRoasts } from '@/lib/dashboardCalculations';
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
  
  const dashboardStats = useMemo(() => calculateDashboardStats(shots), [shots]);
  
  const topRoasts = useMemo(() => calculateTopRoasts(shots, 5), [shots]);

  return (
    <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="xl:col-span-2">
          <StatCard
            title="Total Shots"
            value={dashboardStats.totalShots}
            icon={<TbCoffee strokeWidth={1.17} />}
            className="h-[100px] sm:h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Average Rating"
            value={`${dashboardStats.averageRating}/10`}
            icon={<TbStar strokeWidth={1.17} />}
            className="h-[100px] sm:h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Average Ratio"
            value={`1:${dashboardStats.averageRatio}`}
            subtitle="Target: 1:2.0"
            icon={<TbScale strokeWidth={1.17} />}
            className="h-[100px] sm:h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Favorite Roaster"
            value={dashboardStats.favoriteRoaster}
            icon={<TbHeart strokeWidth={1.17} />}
            className="h-[100px] sm:h-[131.5px]"
          />
        </div>
        
        <div className="xl:col-span-2">
          <StatCard
            title="Avg Grind Time"
            value={`${dashboardStats.averageGrindTime}s`}
            subtitle="Per shot"
            icon={<TbClock strokeWidth={1.17} />}
            className="h-[100px] sm:h-[131.5px]"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-[12.75px] p-6 h-[384px] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TbChartBar className="w-3.5 h-3.5 text-amber-700" strokeWidth={1.17} />
            <h3 className="text-[13px] font-normal text-gray-900 leading-[14px]">
              Grinder Setting Performance
            </h3>
          </div>
          <GrinderPerformanceChart />
        </div>


        <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-[12.75px] p-6 h-[384px] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TbChartBar className="w-3.5 h-3.5 text-amber-700" strokeWidth={1.17} />
            <h3 className="text-[13px] font-normal text-gray-900 leading-[14px]">
              Extraction Time vs Quality
            </h3>
          </div>
          <ExtractionTimeChart />
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-[12.75px] p-6 h-[384px] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TbChartBar className="w-3.5 h-3.5 text-amber-700" strokeWidth={1.17} />
            <h3 className="text-[13px] font-normal text-gray-900 leading-[14px]">
              Extraction Ratio Analysis
            </h3>
          </div>
          <RatioAnalysisChart />
        </div>
      </div>

      {/* Top Performing Roasts Section */}
      <div className="mt-6 sm:mt-8">
        <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-[12.75px] p-6 h-[384px] shadow-sm">
          <h3 className="text-[13px] font-normal text-gray-900 leading-[14px] mb-6">
            Top Performing Roasts
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[300px]">
            {topRoasts.length > 0 ? (
              topRoasts.map((roast, index) => (
                <div key={`roast-${index}-${roast.roasterName}-${roast.roastName}`} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{roast.roastName}</div>
                      <div className="text-sm text-gray-500">
                        {roast.roasterName}
                        {roast.roastDate && (
                          <span className="ml-2 text-xs text-gray-400">
                            • Roasted {new Date(roast.roastDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {roast.shotCount} shot{roast.shotCount !== 1 ? 's' : ''} • 
                        Best grinder: {roast.bestGrinderSetting} • 
                        Avg ratio: 1:{roast.averageRatio} • 
                        Rating: {roast.averageRating}/10
                      </div>
                    </div>
                    <div className="text-xs text-amber-600 font-medium">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <TbCoffee className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No shots recorded yet</p>
                <p className="text-xs text-gray-400 mt-1">Add some espresso shots to see your top roasts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}