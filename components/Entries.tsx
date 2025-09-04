'use client';

import { useState, useMemo } from 'react';
import FiltersPanel from './FiltersPanel';
import { FilterOptions, EspressoShot } from '@/lib/types';
import { useData } from '@/lib/dataContext';
import { groupShotsByRoast, formatRatio, calculateAverageRating, calculateAverageRatio } from '@/lib/mockData';
import { format } from 'date-fns';

interface EntriesProps {
  onEditShot: (shot: EspressoShot) => void;
  onDeleteShot: (shot: EspressoShot) => void;
}

export default function Entries({ onEditShot, onDeleteShot }: EntriesProps) {
  const { shots } = useData();
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    roaster: '',
    roast: '',
    sortBy: 'date-newest',
    groupBy: 'roast-date'
  });

  const filteredAndGroupedShots = useMemo(() => {
    let filteredShots = [...shots];

    // Apply search filter
    if (filters.search) {
      filteredShots = filteredShots.filter(shot =>
        shot.roasterName.toLowerCase().includes(filters.search.toLowerCase()) ||
        shot.roastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        shot.notes.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply roaster filter
    if (filters.roaster) {
      filteredShots = filteredShots.filter(shot => shot.roasterName === filters.roaster);
    }

    // Apply roast filter
    if (filters.roast) {
      filteredShots = filteredShots.filter(shot => shot.roastName === filters.roast);
    }

    // Sort shots
    filteredShots.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-newest':
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
        case 'date-oldest':
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    // Group shots
    return groupShotsByRoast(filteredShots);
  }, [filters, shots]);

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateTime;
    }
  };

  const formatDateHeader = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'dd/MM/yyyy');
    } catch {
      return dateTime;
    }
  };

  return (
    <div className="max-w-[1626px] mx-auto px-8 py-8">
      <FiltersPanel filters={filters} onFiltersChange={setFilters} />
      
      <div className="space-y-8">
        {filteredAndGroupedShots.map((group, groupIndex) => (
          <div key={`${group.roasterName}-${group.roastName}-${groupIndex}`}>
            {/* Group Header */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16.8px] font-semibold text-gray-900 leading-[22.5px]">
                  {group.roasterName} - {group.roastName} ({formatDateHeader(group.date)})
                </h3>
                <div className="flex items-center gap-6">
                  <div className="px-2 py-1 bg-gray-100 rounded-md">
                    <span className="text-[10.5px] font-medium text-gray-900 leading-[12px]">
                      {group.shotCount} shots
                    </span>
                  </div>
                  <span className="text-[12.1px] font-normal text-gray-500 leading-[14.5px]">
                    Avg Rating: {group.averageRating}/10
                  </span>
                  <span className="text-[12.1px] font-normal text-gray-500 leading-[14.5px]">
                    Avg Ratio: 1:{group.averageRatio}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-[12.75px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-[12.1px] font-medium text-gray-900 leading-[14.5px]">
                        Date/Time
                      </th>
                      <th className="text-left px-4 py-3 text-[12.3px] font-medium text-gray-900 leading-[14.5px]">
                        Settings
                      </th>
                      <th className="text-left px-4 py-3 text-[12.3px] font-medium text-gray-900 leading-[14.5px]">
                        Weights & Ratio
                      </th>
                      <th className="text-left px-4 py-3 text-[12.1px] font-medium text-gray-900 leading-[14.5px]">
                        Time
                      </th>
                      <th className="text-left px-4 py-3 text-[12.3px] font-medium text-gray-900 leading-[14.5px]">
                        Rating
                      </th>
                      <th className="text-left px-4 py-3 text-[12.3px] font-medium text-gray-900 leading-[14.5px]">
                        Notes
                      </th>
                      <th className="text-left px-4 py-3 text-[12.1px] font-medium text-gray-900 leading-[14.5px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.shots.map((shot, shotIndex) => (
                      <tr key={shot.id} className={shotIndex < group.shots.length - 1 ? 'border-b border-gray-200' : ''}>
                        <td className="px-4 py-4 text-[12.1px] font-normal text-gray-900 leading-[14.5px]">
                          {formatDateTime(shot.dateTime)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-[12.1px] font-normal text-gray-900 leading-[14.5px]">
                            Grinder: {shot.grinderSetting}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-[12.1px] font-normal text-gray-900 leading-[14.5px]">
                            {shot.coffeeWeight}g → {shot.outputWeight}g
                          </div>
                          <div className="text-[10.5px] font-normal text-gray-500 leading-[13px] mt-1">
                            {formatRatio(shot.coffeeWeight, shot.outputWeight)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[12.1px] font-normal text-gray-900 leading-[14.5px]">
                          {shot.extractionTime}s
                        </td>
                        <td className="px-4 py-4">
                          <div className="inline-flex items-center px-2 py-1 bg-green-50 rounded-md">
                            <span className="text-[10.5px] font-normal text-green-900 leading-[13px]">
                              {shot.rating}/10
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[10.5px] font-normal text-gray-500 leading-[13px] max-w-[200px]">
                          {shot.notes || 'No notes recorded'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => onEditShot(shot)}
                              className="text-[10.5px] font-normal text-blue-600 hover:text-blue-800 leading-[13px]"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">•</span>
                            <button 
                              onClick={() => onDeleteShot(shot)}
                              className="text-[10.5px] font-normal text-red-600 hover:text-red-800 leading-[13px]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}