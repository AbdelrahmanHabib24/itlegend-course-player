/**
 * Formats seconds as a zero-padded MM:SS string.
 */
export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return '00:00';

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}