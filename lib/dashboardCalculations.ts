import { 
  EspressoShot, 
  DashboardStats, 
  GrinderPerformanceData, 
  ShotTypeData, 
  ExtractionTimeData, 
  RatioAnalysisData, 
  TopRoast 
} from './types';
import { 
  calculateRatio, 
  calculateAverageRating, 
  calculateAverageRatio, 
  calculatePerfectionScore,
  groupShotsByRoast
} from './mockData';

/**
 * Calculate comprehensive dashboard statistics from real shot data
 */
export const calculateDashboardStats = (shots: EspressoShot[]): DashboardStats => {
  if (shots.length === 0) {
    return {
      totalShots: 0,
      averageRating: 0,
      averageRatio: 0,
      favoriteRoaster: 'N/A',
      averageGrindTime: 0
    };
  }

  const totalShots = shots.length;
  const averageRating = calculateAverageRating(shots);
  const averageRatio = calculateAverageRatio(shots);
  
  // Find favorite roaster (most frequent)
  const roasterCounts = shots.reduce((acc, shot) => {
    acc[shot.roasterName] = (acc[shot.roasterName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const favoriteRoaster = Object.entries(roasterCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  
  // Calculate average grind time
  const shotsWithGrindTime = shots.filter(shot => shot.grindTime !== undefined && shot.grindTime > 0);
  const totalGrindTime = shotsWithGrindTime.reduce((sum, shot) => sum + (shot.grindTime || 0), 0);
  const averageGrindTime = shotsWithGrindTime.length > 0 
    ? Math.round((totalGrindTime / shotsWithGrindTime.length) * 10) / 10
    : 0;

  return {
    totalShots,
    averageRating,
    averageRatio,
    favoriteRoaster,
    averageGrindTime
  };
};

/**
 * Calculate grinder setting performance metrics
 */
export const calculateGrinderPerformance = (shots: EspressoShot[]): GrinderPerformanceData[] => {
  if (shots.length === 0) return [];

  // Group shots by grinder setting
  const grinderGroups = shots.reduce((acc, shot) => {
    const setting = shot.grinderSetting;
    if (!acc[setting]) {
      acc[setting] = [];
    }
    acc[setting].push(shot);
    return acc;
  }, {} as Record<number, EspressoShot[]>);


  // Calculate performance metrics for each setting
  return Object.entries(grinderGroups)
    .map(([setting, settingShots]) => ({
      setting: parseInt(setting),
      rating: calculateAverageRating(settingShots),
      count: settingShots.length
    }))
    .sort((a, b) => a.setting - b.setting);
};

/**
 * Calculate shot type distribution
 */
export const calculateShotTypeDistribution = (shots: EspressoShot[]): ShotTypeData[] => {
  if (shots.length === 0) return [];

  // Count shots by type
  const typeCounts = shots.reduce((acc, shot) => {
    const type = shot.shotType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalShots = shots.length;

  // Convert to array with percentages
  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalShots) * 100)
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
};

/**
 * Calculate extraction time vs quality correlation data
 */
export const calculateExtractionTimeData = (shots: EspressoShot[]): ExtractionTimeData[] => {
  if (shots.length === 0) return [];

  return shots.map(shot => ({
    time: shot.extractionTime,
    rating: shot.rating
  }));
};

/**
 * Calculate ratio analysis grouping shots by ratio ranges
 */
export const calculateRatioAnalysis = (shots: EspressoShot[]): RatioAnalysisData[] => {
  if (shots.length === 0) return [];

  // Define ratio ranges
  const getRatioRange = (ratio: number): string => {
    if (ratio < 1.6) return '1:1.0-1.5';
    if (ratio < 1.8) return '1:1.6-1.7';
    if (ratio < 2.0) return '1:1.8-1.9';
    if (ratio < 2.2) return '1:2.0-2.1';
    if (ratio < 2.4) return '1:2.2-2.3';
    if (ratio < 2.6) return '1:2.4-2.5';
    return '1:2.6+';
  };

  // Group shots by ratio range
  const ratioGroups = shots.reduce((acc, shot) => {
    const ratio = calculateRatio(shot.coffeeWeight, shot.outputWeight);
    const range = getRatioRange(ratio);
    
    if (!acc[range]) {
      acc[range] = [];
    }
    acc[range].push(shot);
    return acc;
  }, {} as Record<string, EspressoShot[]>);

  // Calculate metrics for each range
  return Object.entries(ratioGroups)
    .map(([range, rangeShots]) => ({
      ratio: range,
      count: rangeShots.length,
      averageRating: calculateAverageRating(rangeShots)
    }))
    .sort((a, b) => {
      // Sort by the numerical value of the ratio range
      const aNum = parseFloat(a.ratio.split(':')[1].split('-')[0]);
      const bNum = parseFloat(b.ratio.split(':')[1].split('-')[0]);
      return aNum - bNum;
    });
};

/**
 * Calculate top performing roasts based on perfection score
 */
export const calculateTopRoasts = (shots: EspressoShot[], limit: number = 10): TopRoast[] => {
  if (shots.length === 0) return [];

  const roastGroups = groupShotsByRoast(shots);

  return roastGroups
    .map(group => {
      const { roasterName, roastName, shots: roastShots } = group;
      
      // Calculate best grinder setting (mode - most frequent)
      const grinderCounts = roastShots.reduce((acc, shot) => {
        acc[shot.grinderSetting] = (acc[shot.grinderSetting] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const bestGrinderSetting = parseInt(
        Object.entries(grinderCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '0'
      );

      // Calculate average perfection score for sorting
      const averagePerfectionScore = roastShots.reduce((sum, shot) => {
        return sum + calculatePerfectionScore(shot);
      }, 0) / roastShots.length;

      return {
        roasterName,
        roastName,
        roastDate: group.roastDate,
        shotCount: roastShots.length,
        bestGrinderSetting,
        averageRatio: group.averageRatio,
        averageRating: group.averageRating,
        perfectionScore: averagePerfectionScore // Internal field for sorting
      };
    })
    .sort((a, b) => {
      // Sort by perfection score descending, then by shot count descending
      if (b.perfectionScore !== a.perfectionScore) {
        return b.perfectionScore - a.perfectionScore;
      }
      return b.shotCount - a.shotCount;
    })
    .slice(0, limit)
    .map(({ perfectionScore: _, ...roast }) => roast); // Remove internal field
};

/**
 * Utility function to get performance insights
 */
export const getPerformanceInsights = (shots: EspressoShot[]) => {
  if (shots.length === 0) return null;

  const grinderPerformance = calculateGrinderPerformance(shots);
  const ratioAnalysis = calculateRatioAnalysis(shots);
  
  // Find best performing grinder setting
  const bestGrinderSetting = grinderPerformance
    .sort((a, b) => b.rating - a.rating)[0];

  // Find optimal ratio range
  const bestRatioRange = ratioAnalysis
    .sort((a, b) => b.averageRating - a.averageRating)[0];

  return {
    bestGrinderSetting: bestGrinderSetting?.setting,
    bestGrinderRating: bestGrinderSetting?.rating,
    optimalRatioRange: bestRatioRange?.ratio,
    optimalRatioRating: bestRatioRange?.averageRating
  };
};