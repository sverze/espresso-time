import { EspressoShot, DashboardStats, GrinderPerformanceData, ShotTypeData, ExtractionTimeData, RatioAnalysisData, TopRoast } from './types';

export const mockEspressoShots: EspressoShot[] = [
  {
    id: '1',
    roasterName: 'Valencia',
    roastName: 'Standard',
    roastDate: '2025-08-20',
    dateTime: '2025-08-29T08:30:00',
    grinderSetting: 11,
    grindTime: 15,
    coffeeWeight: 18,
    outputWeight: 38,
    extractionTime: 28,
    shotType: 'Double',
    rating: 8.5,
    notes: 'Balanced with bright acidity, hints of citrus',
    usedMilk: false,
    createdAt: '2025-08-29T08:30:00'
  },
  {
    id: '2',
    roasterName: 'Valencia',
    roastName: 'Standard',
    roastDate: '2025-08-20',
    dateTime: '2025-08-29T09:15:00',
    grinderSetting: 12,
    grindTime: 14,
    coffeeWeight: 18,
    outputWeight: 37,
    extractionTime: 26,
    shotType: 'Double',
    rating: 8.5,
    notes: 'Sweet finish, well extracted',
    usedMilk: false,
    createdAt: '2025-08-29T09:15:00'
  },
  {
    id: '3',
    roasterName: 'Stumptown Coffee',
    roastName: 'Hair Bender',
    roastDate: '2024-01-05',
    dateTime: '2024-01-12T07:45:00',
    grinderSetting: 14,
    grindTime: 16,
    coffeeWeight: 18,
    outputWeight: 45,
    extractionTime: 32,
    shotType: 'Double',
    rating: 7.0,
    notes: '',
    usedMilk: false,
    createdAt: '2024-01-12T07:45:00'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalShots: 3,
  averageRating: 8.0,
  averageRatio: 2.0,
  favoriteRoaster: 'Blue Bottle Coffee',
  averageGrindTime: 15.0
};

export const mockGrinderPerformanceData: GrinderPerformanceData[] = [
  { setting: 9, rating: 6.5, count: 2 },
  { setting: 10, rating: 7.2, count: 4 },
  { setting: 11, rating: 8.1, count: 6 },
  { setting: 12, rating: 8.5, count: 8 },
  { setting: 13, rating: 8.2, count: 5 },
  { setting: 14, rating: 7.8, count: 3 },
  { setting: 15, rating: 7.0, count: 2 }
];

export const mockShotTypeData: ShotTypeData[] = [
  { type: 'Single', count: 12, percentage: 40 },
  { type: 'Double', count: 15, percentage: 50 },
  { type: 'Lungo', count: 3, percentage: 10 }
];

export const mockExtractionTimeData: ExtractionTimeData[] = [
  { time: 22, rating: 6.5 },
  { time: 24, rating: 7.2 },
  { time: 26, rating: 8.1 },
  { time: 28, rating: 8.5 },
  { time: 30, rating: 8.2 },
  { time: 32, rating: 7.8 },
  { time: 34, rating: 7.0 },
  { time: 26, rating: 8.0 },
  { time: 28, rating: 8.3 },
  { time: 30, rating: 7.9 }
];

export const mockRatioAnalysisData: RatioAnalysisData[] = [
  { ratio: '1:1.5', count: 2, averageRating: 6.8 },
  { ratio: '1:1.8', count: 5, averageRating: 7.5 },
  { ratio: '1:2.0', count: 8, averageRating: 8.2 },
  { ratio: '1:2.2', count: 6, averageRating: 8.0 },
  { ratio: '1:2.5', count: 4, averageRating: 7.3 }
];

export const mockTopRoasts: TopRoast[] = [
  {
    roasterName: 'Intelligentsia',
    roastName: 'Black Cat Classic',
    shotCount: 1,
    bestGrinderSetting: 11,
    averageRatio: 1.9,
    averageRating: 9.2
  },
  {
    roasterName: 'Blue Bottle Coffee',
    roastName: 'Bella Donovan',
    shotCount: 1,
    bestGrinderSetting: 12,
    averageRatio: 2.0,
    averageRating: 8.8
  },
  {
    roasterName: 'Stumptown Coffee',
    roastName: 'Hair Bender',
    shotCount: 1,
    bestGrinderSetting: 14,
    averageRatio: 2.1,
    averageRating: 8.5
  }
];

// Utility functions for data processing
export const calculateRatio = (coffeeWeight: number, outputWeight: number): number => {
  return Math.round((outputWeight / coffeeWeight) * 10) / 10;
};

export const formatRatio = (coffeeWeight: number, outputWeight: number): string => {
  const ratio = calculateRatio(coffeeWeight, outputWeight);
  return `1:${ratio}`;
};

export const calculateAverageRating = (shots: EspressoShot[]): number => {
  if (shots.length === 0) return 0;
  const sum = shots.reduce((acc, shot) => acc + shot.rating, 0);
  return Math.round((sum / shots.length) * 10) / 10;
};

export const calculateAverageRatio = (shots: EspressoShot[]): number => {
  if (shots.length === 0) return 0;
  const sum = shots.reduce((acc, shot) => acc + calculateRatio(shot.coffeeWeight, shot.outputWeight), 0);
  return Math.round((sum / shots.length) * 10) / 10;
};

// Heat map scoring: Calculate how close a shot is to perfect (ratio 1:2, rating 10/10)
export const calculatePerfectionScore = (shot: EspressoShot): number => {
  const targetRatio = 2.0;
  const targetRating = 10;
  
  const actualRatio = calculateRatio(shot.coffeeWeight, shot.outputWeight);
  
  // Calculate ratio score (0-1, where 1 is perfect)
  // Use exponential decay for ratio difference to heavily penalize deviations
  const ratioDiff = Math.abs(actualRatio - targetRatio);
  const ratioScore = Math.exp(-ratioDiff * 2); // Heavily penalize ratio deviations
  
  // Calculate rating score (0-1, where 1 is perfect)
  const ratingScore = shot.rating / targetRating;
  
  // Combined score: 60% ratio weight, 40% rating weight
  const combinedScore = (ratioScore * 0.6) + (ratingScore * 0.4);
  
  return combinedScore;
};

// Find the best shot in each group based on perfection score
export const findBestShotsInGroups = (groupedShots: ReturnType<typeof groupShotsByRoast>): Set<string> => {
  const bestShotIds = new Set<string>();
  
  groupedShots.forEach(group => {
    if (group.shots.length === 0) return;
    
    let bestShot = group.shots[0];
    let bestScore = calculatePerfectionScore(bestShot);
    
    group.shots.forEach(shot => {
      const score = calculatePerfectionScore(shot);
      if (score > bestScore) {
        bestScore = score;
        bestShot = shot;
      }
    });
    
    bestShotIds.add(bestShot.id);
  });
  
  return bestShotIds;
};

export const groupShotsByRoast = (shots: EspressoShot[]) => {
  const groups: { [key: string]: EspressoShot[] } = {};
  
  shots.forEach(shot => {
    // Include roastDate in the grouping key to separate different bags
    const roastDateKey = shot.roastDate || 'unknown';
    const key = `${shot.roasterName} - ${shot.roastName} - ${roastDateKey}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(shot);
  });
  
  return Object.entries(groups).map(([key, shots]) => {
    const keyParts = key.split(' - ');
    const roasterName = keyParts[0];
    const roastName = keyParts[1];
    const roastDate = keyParts[2] === 'unknown' ? undefined : keyParts[2];
    
    return {
      roasterName,
      roastName,
      roastDate,
      shots,
      averageRating: calculateAverageRating(shots),
      averageRatio: calculateAverageRatio(shots),
      shotCount: shots.length,
      // Get the most recent shot's date for the group (for sorting purposes)
      date: shots.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0].dateTime
    };
  });
};