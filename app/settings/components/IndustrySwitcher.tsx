'use client';

import { useIndustry } from '../../../context/useIndustry';
import { Industry } from '../../../lib/config/terminology';

const industries: Array<{ id: Industry; name: string; description: string }> = [
  { id: 'salon', name: 'Salon / Spa', description: 'Appointments, services, stylists' },
  { id: 'clinic', name: 'Clinic / Medical', description: 'Consultations, patients, doctors' },
  { id: 'retail', name: 'Retail / Store', description: 'Bookings, customers, sales agents' },
  { id: 'delivery', name: 'Delivery Service', description: 'Delivery slots, clients, drivers' },
  { id: 'school', name: 'School / Academy', description: 'Sessions, students, teachers' },
];

export const IndustrySwitcher = () => {
  const { currentIndustry, setCurrentIndustry, terminology } = useIndustry();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Business Type</h3>
        <p className="text-gray-600 text-sm">
          Switch between different industry configurations. This changes terminology and demo data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => setCurrentIndustry(industry.id)}
            className={`p-4 border rounded-lg text-left transition-all ${
              currentIndustry === industry.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{industry.name}</div>
                <div className="text-sm text-gray-600 mt-1">{industry.description}</div>
              </div>
              {currentIndustry === industry.id && (
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            {currentIndustry === industry.id && (
              <div className="mt-3 pt-3 border-t border-blue-100">
                <div className="text-xs text-gray-700">
                  Current terms: {terminology.appointment}, {terminology.customer}, {terminology.staff}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="font-medium">Current Configuration:</div>
        <div className="text-sm text-gray-700 mt-1">
          You are viewing the dashboard as a <strong>{terminology.business}</strong>.
          Customers are called <strong>{terminology.customer}s</strong>, 
          appointments are <strong>{terminology.appointment}s</strong>,
          and staff are <strong>{terminology.staff}s</strong>.
        </div>
      </div>
    </div>
  );
};
