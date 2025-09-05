'use client';

import { TbCoffee } from 'react-icons/tb';
import { HiPlus } from 'react-icons/hi2';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '@/lib/authContext';

interface HeaderProps {
  entryCount: number;
  onAddShot: () => void;
}

export default function Header({ entryCount, onAddShot }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1344px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Coffee Icon */}
            <div className="w-7 h-7">
              <TbCoffee className="w-full h-full text-gray-900" strokeWidth={2.33} />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-[25px] font-normal text-gray-900 leading-[31px]">
                Espresso Time
              </h1>
              <p className="text-[13px] font-normal text-gray-500 leading-[21px] mt-1">
                Perfect your espresso shots and master your machine settings
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md">
              <FiUser className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-[11px] font-normal text-gray-700 leading-[17px]">
                {user?.username}
              </span>
            </div>

            {/* Entry Count Badge */}
            <div className="px-2 py-1 border border-gray-300 rounded-md">
              <span className="text-[11px] font-normal text-gray-900 leading-[17px]">
                {entryCount} entries
              </span>
            </div>
            
            {/* Add Shot Button */}
            <button
              onClick={onAddShot}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <HiPlus className="w-3.5 h-3.5" strokeWidth={1.17} />
              <span className="text-[11.5px] font-normal leading-[17px]">
                Add Espresso Shot
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
              title="Sign out"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="text-[11px] font-normal leading-[17px]">
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}