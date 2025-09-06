'use client';

import { TabType } from '@/lib/types';
import { TbChartBar, TbList, TbChartPie } from 'react-icons/tb';
import clsx from 'clsx';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: TbChartBar
    },
    {
      id: 'entries' as TabType,
      label: 'Entries',
      icon: TbList
    },
    {
      id: 'insights' as TabType,
      label: 'Insights',
      icon: TbChartPie
    }
  ];

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex sm:inline-flex items-center bg-amber-100 rounded-[12.75px] p-1 w-full sm:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  'flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 rounded-[12.75px] transition-colors whitespace-nowrap flex-1 sm:flex-none justify-center',
                  'text-[10px] sm:text-[11.5px] font-normal leading-[17px]',
                  isActive 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'text-amber-800 hover:bg-amber-50'
                )}
              >
                <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5" strokeWidth={1.17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}