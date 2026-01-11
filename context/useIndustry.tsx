// Industry context using React Context (no localStorage)

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Industry, DEFAULT_INDUSTRY, getTerminology } from '../lib/config/terminology';

interface IndustryContextType {
  currentIndustry: Industry;
  setCurrentIndustry: (industry: Industry) => void;
  terminology: ReturnType<typeof getTerminology>;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

interface IndustryProviderProps {
  children: ReactNode;
  initialIndustry?: Industry;
}

export function IndustryProvider({ 
  children, 
  initialIndustry = DEFAULT_INDUSTRY 
}: IndustryProviderProps) {
  const [currentIndustry, setCurrentIndustry] = useState<Industry>(initialIndustry);
  
  const value = {
    currentIndustry,
    setCurrentIndustry,
    terminology: getTerminology(currentIndustry)
  };

  return (
    <IndustryContext.Provider value={value}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
}

export function useTerminology() {
  const { terminology } = useIndustry();
  return terminology;
}
