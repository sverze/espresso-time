'use client';

import { useMemo } from 'react';
import { FilterOptions } from '@/lib/types';
import { useData } from '@/lib/dataContext';
import { TbFilter, TbSearch } from 'react-icons/tb';
import { HiChevronDown } from 'react-icons/hi2';
import { format } from 'date-fns';

interface FiltersPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  const { shots } = useData();
  
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Generate dynamic roaster options
  const roasterOptions = useMemo(() => {
    const roasters = [...new Set(shots.map(shot => shot.roasterName))];
    return roasters.sort();
  }, [shots]);

  // Generate dynamic roast options with most recent roast date info
  const roastOptions = useMemo(() => {
    // Get unique roast names with their most recent roast date
    const roastMap = new Map<string, { roastName: string; mostRecentDate?: string; mostRecentShot: string }>;
    
    shots.forEach(shot => {
      const key = shot.roastName;
      const existing = roastMap.get(key);
      
      if (!existing || new Date(shot.dateTime) > new Date(existing.mostRecentShot)) {
        roastMap.set(key, {
          roastName: shot.roastName,
          mostRecentDate: shot.roastDate,
          mostRecentShot: shot.dateTime
        });
      }
    });
    
    // Convert to array and sort by most recent shot date
    return Array.from(roastMap.values())
      .sort((a, b) => new Date(b.mostRecentShot).getTime() - new Date(a.mostRecentShot).getTime())
      .slice(0, 20) // Limit to most recent 20
      .map(roast => {
        const dateDisplay = roast.mostRecentDate 
          ? ` (Latest: ${format(new Date(roast.mostRecentDate), 'dd/MM/yyyy')})`
          : '';
        return {
          value: roast.roastName,
          label: `${roast.roastName}${dateDisplay}`
        };
      });
  }, [shots]);

  return (
    <div className="bg-white border border-gray-200 rounded-[12.75px] p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TbFilter className="w-[17.5px] h-[17.5px] text-gray-900" strokeWidth={1.46} />
        <h4 className="text-[13.7px] font-normal text-gray-900 leading-[16.5px]">
          Filters
        </h4>
      </div>

      {/* Search Field */}
      <div className="mb-6">
        <label className="block text-[12.1px] font-normal text-gray-900 leading-[14.5px] mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search by roaster, roast name, or notes..."
            className="w-full h-[31.5px] px-9 py-2 bg-gray-50 rounded-md border-0 text-[12.1px] font-normal text-gray-900 leading-[14.5px] placeholder-gray-500"
          />
          <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" strokeWidth={1.17} />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Filter by Roaster */}
        <div>
          <label className="block text-[12.1px] font-normal text-gray-900 leading-[14.5px] mb-2">
            Filter by Roaster
          </label>
          <div className="relative">
            <select
              value={filters.roaster}
              onChange={(e) => updateFilter('roaster', e.target.value)}
              className="w-full h-[31.5px] px-3 py-2 bg-gray-50 rounded-md border-0 text-[12.1px] font-normal text-gray-900 leading-[17.5px] appearance-none cursor-pointer"
            >
              <option value="">All Roasters</option>
              {roasterOptions.map(roaster => (
                <option key={roaster} value={roaster}>{roaster}</option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 opacity-50" />
          </div>
        </div>

        {/* Filter by Roast */}
        <div>
          <label className="block text-[12.1px] font-normal text-gray-900 leading-[14.5px] mb-2">
            Filter by Roast
          </label>
          <div className="relative">
            <select
              value={filters.roast}
              onChange={(e) => updateFilter('roast', e.target.value)}
              className="w-full h-[31.5px] px-3 py-2 bg-gray-50 rounded-md border-0 text-[12.1px] font-normal text-gray-900 leading-[17.5px] appearance-none cursor-pointer"
            >
              <option value="">All Roasts</option>
              {roastOptions.map(roast => (
                <option key={roast.value} value={roast.value}>{roast.label}</option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 opacity-50" />
          </div>
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-[12.1px] font-normal text-gray-900 leading-[14.5px] mb-2">
            Sort by
          </label>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full h-[31.5px] px-3 py-2 bg-gray-50 rounded-md border-0 text-[12.1px] font-normal text-gray-900 leading-[17.5px] appearance-none cursor-pointer"
            >
              <option value="date-newest">Date (Newest)</option>
              <option value="date-oldest">Date (Oldest)</option>
              <option value="rating-high">Rating (High to Low)</option>
              <option value="rating-low">Rating (Low to High)</option>
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 opacity-50" />
          </div>
        </div>

        {/* Group by */}
        <div>
          <label className="block text-[12.1px] font-normal text-gray-900 leading-[14.5px] mb-2">
            Group by
          </label>
          <div className="relative">
            <select
              value={filters.groupBy}
              onChange={(e) => updateFilter('groupBy', e.target.value)}
              className="w-full h-[31.5px] px-3 py-2 bg-gray-50 rounded-md border-0 text-[12.1px] font-normal text-gray-900 leading-[17.5px] appearance-none cursor-pointer"
            >
              <option value="roast-date">Roast Name & Date</option>
              <option value="roaster">Roaster</option>
              <option value="date">Date</option>
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}