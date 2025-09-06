import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  className?: string;
}

export default function StatCard({ title, value, subtitle, icon, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-amber-200 rounded-[12.75px] p-4 sm:p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-[10px] sm:text-[11.3px] font-normal text-gray-900 leading-[17px] mb-3 sm:mb-6">
            {title}
          </h4>
          <div className="space-y-1">
            <div className="text-lg sm:text-[21px] font-normal text-gray-900 leading-tight sm:leading-[28px]">
              {value}
            </div>
            {subtitle && (
              <div className="text-[9px] sm:text-[10px] font-normal text-gray-500 leading-[14px]">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}