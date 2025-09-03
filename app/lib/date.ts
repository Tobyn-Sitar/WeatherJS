export function localDateKey(unixSeconds: number, tzOffsetSeconds: number): string {
  const localMs = (unixSeconds + tzOffsetSeconds) * 1000;
  return new Date(localMs).toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function weekdayFromKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

export function monthDayFromKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' });
}