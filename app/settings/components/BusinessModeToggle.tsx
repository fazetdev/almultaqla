'use client';

import React from 'react';

interface BusinessModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  label?: string;
  description?: string;
}

export const BusinessModeToggle: React.FC<BusinessModeToggleProps> = ({
  isEnabled,
  onToggle,
  label = "Business Mode",
  description = "Configure business operation mode"
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="mb-4">
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button 
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          isEnabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
