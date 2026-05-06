export const formatTemperature = (temp: number, unit: string = "°"): string => {
  return `${Math.round(temp)}${unit}`;
};

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export const formatDate = (utcTimestamp: number, timezoneOffset: number = 0): string => {
  const date = new Date((utcTimestamp + timezoneOffset) * 1000);
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
  const suffix = getDaySuffix(day);

  return `${weekday}, ${day}${suffix} ${month}`;
};

export const getWeekday = (timestamp: number, dayOffset: number = 0): string => {
  if (!timestamp) return "";
  const date = new Date((timestamp * 1000) + (dayOffset * 24 * 60 * 60 * 1000));

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    timeZone: 'UTC'
  });
};

export const formatHour = (timestamp: number, timezoneOffset: number = 0): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });
};