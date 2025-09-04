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
    <div className={`bg-white border border-gray-200 rounded-[12.75px] p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-[11.3px] font-normal text-gray-900 leading-[17px] mb-6">
            {title}
          </h4>
          <div className="space-y-1">
            <div className="text-[21px] font-normal text-gray-900 leading-[28px]">
              {value}
            </div>
            {subtitle && (
              <div className="text-[10px] font-normal text-gray-500 leading-[14px]">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="w-3.5 h-3.5 text-gray-500 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}