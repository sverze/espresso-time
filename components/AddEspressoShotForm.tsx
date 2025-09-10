'use client';

import { useState, useMemo } from 'react';
import { EspressoShotFormData, EspressoShot } from '@/lib/types';
import { useData } from '@/lib/dataContext';
import { formatRatio } from '@/lib/mockData';
import StarRating from './StarRating';
import { TbSettings, TbScale } from 'react-icons/tb';
import { HiChevronDown } from 'react-icons/hi2';

interface AddEspressoShotFormProps {
  onSubmit: (data: EspressoShotFormData) => void;
  onCancel: () => void;
  editingShot?: EspressoShot;
}

export default function AddEspressoShotForm({ onSubmit, onCancel, editingShot }: AddEspressoShotFormProps) {
  const { shots } = useData();
  const [formData, setFormData] = useState<EspressoShotFormData>(() => {
    if (editingShot) {
      return {
        isNewRoast: false,
        roasterName: editingShot.roasterName,
        roastName: editingShot.roastName,
        roastDate: editingShot.roastDate || '',
        grinderSetting: editingShot.grinderSetting,
        grindTime: editingShot.grindTime || 15,
        coffeeWeight: editingShot.coffeeWeight,
        shotType: editingShot.shotType,
        extractionTime: editingShot.extractionTime,
        outputWeight: editingShot.outputWeight,
        rating: editingShot.rating,
        usedMilk: editingShot.usedMilk || false,
        frothLevel: editingShot.frothLevel || 6,
        notes: editingShot.notes
      };
    }
    
    return {
      isNewRoast: true,
      roasterName: '',
      roastName: '',
      roastDate: '',
      grinderSetting: 12,
      grindTime: 15,
      coffeeWeight: 18,
      shotType: 'Double',
      extractionTime: 28,
      outputWeight: 36,
      rating: 5,
      usedMilk: false,
      frothLevel: 6,
      notes: ''
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EspressoShotFormData, string>>>({});

  // Get unique roast combinations (including roast dates) from existing shots
  const existingRoasts = useMemo(() => {
    const roastMap = new Map();
    shots.forEach(shot => {
      // Include roast date in the key to separate different bags
      const roastDateKey = shot.roastDate || 'unknown';
      const key = `${shot.roasterName}|${shot.roastName}|${roastDateKey}`;
      if (!roastMap.has(key)) {
        roastMap.set(key, {
          roasterName: shot.roasterName,
          roastName: shot.roastName,
          roastDate: shot.roastDate,
          mostRecentShot: shot.dateTime
        });
      } else {
        // Keep track of most recent shot for sorting
        const existing = roastMap.get(key);
        if (new Date(shot.dateTime) > new Date(existing.mostRecentShot)) {
          existing.mostRecentShot = shot.dateTime;
        }
      }
    });
    
    // Sort by most recent shot date and limit to 20 most recent
    return Array.from(roastMap.values())
      .sort((a, b) => new Date(b.mostRecentShot).getTime() - new Date(a.mostRecentShot).getTime())
      .slice(0, 20);
  }, [shots]);

  const updateFormData = (field: keyof EspressoShotFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EspressoShotFormData, string>> = {};

    if (formData.isNewRoast) {
      if (!formData.roasterName.trim()) newErrors.roasterName = 'Roaster name is required';
      if (!formData.roastName.trim()) newErrors.roastName = 'Roast name is required';
      if (!formData.roastDate) newErrors.roastDate = 'Roast date is required';
    }
    
    if (formData.grinderSetting < 1 || formData.grinderSetting > 30) {
      newErrors.grinderSetting = 'Grinder setting must be between 1-30';
    }
    if (formData.coffeeWeight <= 0) newErrors.coffeeWeight = 'Coffee weight must be greater than 0';
    if (formData.outputWeight <= 0) newErrors.outputWeight = 'Espresso weight must be greater than 0';
    if (formData.extractionTime <= 0) newErrors.extractionTime = 'Extraction time must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };


  const getTargetWeight = (shotType: string, coffeeWeight: number): string => {
    const multiplier = shotType === 'Single' ? 1.5 : 2.0;
    return `${Math.round(coffeeWeight * multiplier)}g (1:${multiplier} ratio)`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Bean Information Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <TbScale className="w-4 h-4" />
          Bean Information
        </h3>
        
        {/* Roast Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Select Roast
          </label>
          <div className="relative">
            <select
              value={formData.isNewRoast ? 'new' : `${formData.roasterName}|${formData.roastName}|${formData.roastDate || 'unknown'}`}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  updateFormData('isNewRoast', true);
                  updateFormData('roasterName', '');
                  updateFormData('roastName', '');
                  updateFormData('roastDate', '');
                } else {
                  const [roasterName, roastName, roastDateKey] = e.target.value.split('|');
                  const roast = existingRoasts.find(r => 
                    r.roasterName === roasterName && 
                    r.roastName === roastName && 
                    (r.roastDate || 'unknown') === roastDateKey
                  );
                  updateFormData('isNewRoast', false);
                  updateFormData('roasterName', roasterName);
                  updateFormData('roastName', roastName);
                  updateFormData('roastDate', roast?.roastDate || '');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="new">+ Create New Roast</option>
              {existingRoasts.map(roast => {
                const roastDateDisplay = roast.roastDate 
                  ? ` (${new Date(roast.roastDate).toLocaleDateString('en-GB')})` 
                  : '';
                const key = `${roast.roasterName}|${roast.roastName}|${roast.roastDate || 'unknown'}`;
                return (
                  <option key={key} value={key}>
                    {roast.roasterName} - {roast.roastName}{roastDateDisplay}
                  </option>
                );
              })}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Select an existing roast from your 250g bag or create a new one
          </p>
        </div>

        {/* New Roast Fields */}
        {formData.isNewRoast && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Roaster *
              </label>
              <input
                type="text"
                value={formData.roasterName}
                onChange={(e) => updateFormData('roasterName', e.target.value)}
                placeholder="e.g., Blue Bottle, Stumptown"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.roasterName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.roasterName && <p className="mt-1 text-xs text-red-600">{errors.roasterName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Roast Name *
              </label>
              <input
                type="text"
                value={formData.roastName}
                onChange={(e) => updateFormData('roastName', e.target.value)}
                placeholder="e.g., Bella Donovan, Hair Ben"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.roastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.roastName && <p className="mt-1 text-xs text-red-600">{errors.roastName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Roast Date *
              </label>
              <input
                type="date"
                value={formData.roastDate}
                onChange={(e) => updateFormData('roastDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.roastDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.roastDate && <p className="mt-1 text-xs text-red-600">{errors.roastDate}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Machine Settings Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <TbSettings className="w-4 h-4" />
          Machine Settings
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Grinder Setting (1-30) *
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.grinderSetting}
              onChange={(e) => updateFormData('grinderSetting', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.grinderSetting ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.grinderSetting && <p className="mt-1 text-xs text-red-600">{errors.grinderSetting}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Grind Time (s) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.grindTime}
              onChange={(e) => updateFormData('grindTime', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">10-20s for double</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Coffee Weight (g) *
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.coffeeWeight}
              onChange={(e) => updateFormData('coffeeWeight', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.coffeeWeight ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">Target: 18g for double shot</p>
            {errors.coffeeWeight && <p className="mt-1 text-xs text-red-600">{errors.coffeeWeight}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Shot Type *
            </label>
            <div className="relative">
              <select
                value={formData.shotType}
                onChange={(e) => updateFormData('shotType', e.target.value as 'Single' | 'Double' | 'Lungo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Lungo">Lungo</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Extraction Time (s) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.extractionTime}
              onChange={(e) => updateFormData('extractionTime', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.extractionTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">Target: 25-30 seconds</p>
            {errors.extractionTime && <p className="mt-1 text-xs text-red-600">{errors.extractionTime}</p>}
          </div>
        </div>
      </div>

      {/* Shot Results Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900">Shot Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Espresso Weight (g) *
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.outputWeight}
              onChange={(e) => updateFormData('outputWeight', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.outputWeight ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Target: {getTargetWeight(formData.shotType, formData.coffeeWeight)}
            </p>
            {formData.coffeeWeight > 0 && formData.outputWeight > 0 && (
              <p className="mt-1 text-xs font-medium text-blue-600">
                Current ratio: {formatRatio(formData.coffeeWeight, formData.outputWeight)}
              </p>
            )}
            {errors.outputWeight && <p className="mt-1 text-xs text-red-600">{errors.outputWeight}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quality Rating (1-10) *
            </label>
            <StarRating
              rating={formData.rating}
              onChange={(rating) => updateFormData('rating', rating)}
              maxRating={10}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Milk/Latte Settings */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <span>🥛</span> Milk/Latte Settings
        </h3>
        
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.usedMilk}
            onChange={(e) => updateFormData('usedMilk', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-900">
            Used milk (making latte/cappuccino)
          </span>
        </label>

        {formData.usedMilk && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Froth Level (0-8) *
            </label>
            <input
              type="number"
              min="0"
              max="8"
              value={formData.frothLevel}
              onChange={(e) => updateFormData('frothLevel', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
            />
            <p className="mt-1 text-xs text-gray-500">
              0 = No froth (flat white), 8 = Maximum froth (cappuccino)
            </p>
          </div>
        )}
      </div>

      {/* Tasting Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Tasting Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={3}
          placeholder="Describe the flavor, aroma, balance, or any notes about this shot..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {editingShot ? 'Update Shot' : 'Save Shot'}
        </button>
      </div>
    </form>
  );
}