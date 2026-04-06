// Utility to convert 24-hour time format to 12-hour AM/PM format
export const convertTo12Hour = (time24) => {
  if (!time24 || typeof time24 !== 'string') return time24;
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

// Utility to convert ISO datetime to local formatted time
// Handles UTC to local timezone conversion
export const convertISOToTime = (isoString) => {
  if (!isoString) return '00:00 AM';
  
  try {
    const date = new Date(isoString);
    
    // If this is a UTC datetime (from Google Calendar), convert to local
    // The Date object automatically handles this conversion
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } catch (error) {
    console.error('Error converting ISO to time:', error);
    return '00:00 AM';
  }
};
