export const convertTemperature = (temp, unit) => {
  if (unit === "C") {
    return ((temp - 32) * 5) / 9;
  }
  return temp;
};

export const formatTemperature = (temp, unit = "°") => {
  return `${Math.round(temp)}${unit}`;
};

const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export const formatDate = (utcTimestamp, timezoneOffset = 0) => {
  const date = new Date((utcTimestamp + timezoneOffset) * 1000);
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
  const suffix = getDaySuffix(day);

  return `${weekday}, ${day}${suffix} ${month}`;
};

export const getWeekday = (timestamp, dayOffset = 0) => {
  if (!timestamp) return "";
  const date = new Date((timestamp * 1000) + (dayOffset * 24 * 60 * 60 * 1000));

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    timeZone: 'UTC'
  });
};

export const formatHour = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};