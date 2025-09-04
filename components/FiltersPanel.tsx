'use client';

import { FilterOptions } from '@/lib/types';
import { TbFilter, TbSearch } from 'react-icons/tb';
import { HiChevronDown } from 'react-icons/hi2';

interface FiltersPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

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
              <option value="Valencia">Valencia</option>
              <option value="Stumptown Coffee">Stumptown Coffee</option>
              <option value="Blue Bottle Coffee">Blue Bottle Coffee</option>
              <option value="Intelligentsia">Intelligentsia</option>
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
              <option value="Standard">Standard</option>
              <option value="Hair Bender">Hair Bender</option>
              <option value="Bella Donovan">Bella Donovan</option>
              <option value="Black Cat Classic">Black Cat Classic</option>
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