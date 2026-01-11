// ScheduleSettings - Generic schedule configuration
// Replaces prayer-specific settings

interface ScheduleSettingsProps {
  onSave?: (settings: any) => Promise<void>;
}

export const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({ onSave }) => {
  // Will be implemented with backend data
  return (
    <div className="schedule-settings">
      <h3>Schedule Configuration</h3>
      <p>Configure business hours and time settings</p>
    </div>
  );
};
