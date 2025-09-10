export interface EspressoShot {
  id: string;
  roasterName: string;
  roastName: string;
  roastDate?: string;
  dateTime: string;
  grinderSetting: number;
  grindTime?: number; // in seconds
  coffeeWeight: number; // in grams
  outputWeight: number; // in grams
  extractionTime: number; // in seconds
  shotType: 'Single' | 'Double' | 'Lungo';
  rating: number; // out of 10
  notes: string;
  usedMilk?: boolean;
  frothLevel?: number; // 0-8, only relevant when usedMilk is true
  createdAt: string;
}

export interface RoastGroup {
  roasterName: string;
  roastName: string;
  roastDate: string | undefined;
  date: string; // Keep this for backward compatibility with recent shot date
  shots: EspressoShot[];
  averageRating: number;
  averageRatio: number;
  shotCount: number;
}

export interface DashboardStats {
  totalShots: number;
  averageRating: number;
  averageRatio: number;
  favoriteRoaster: string;
  averageGrindTime: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  rating?: number;
  time?: number;
  ratio?: number;
}

export interface GrinderPerformanceData {
  setting: number;
  rating: number;
  count: number;
}

export interface ShotTypeData {
  type: string;
  count: number;
  percentage: number;
}

export interface ExtractionTimeData {
  time: number;
  rating: number;
}

export interface RatioAnalysisData {
  ratio: string;
  count: number;
  averageRating: number;
}

export interface TopRoast {
  roasterName: string;
  roastName: string;
  roastDate?: string;
  shotCount: number;
  bestGrinderSetting: number;
  averageRatio: number;
  averageRating: number;
}

export type TabType = 'dashboard' | 'entries' | 'insights';

export interface FilterOptions {
  search: string;
  roaster: string;
  roast: string;
  sortBy: 'date-newest' | 'date-oldest' | 'rating-high' | 'rating-low';
  groupBy: 'roast-date' | 'roaster' | 'date';
}

export interface EspressoShotFormData {
  // Bean Information
  isNewRoast: boolean;
  roasterName: string;
  roastName: string;
  roastDate: string;
  existingRoastId?: string;
  
  // Machine Settings
  grinderSetting: number;
  grindTime: number;
  coffeeWeight: number;
  shotType: 'Single' | 'Double' | 'Lungo';
  extractionTime: number;
  
  // Shot Results
  outputWeight: number;
  rating: number;
  
  // Additional
  usedMilk: boolean;
  frothLevel: number; // 0-8, defaults to 6
  notes: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}