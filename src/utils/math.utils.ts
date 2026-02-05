/**
 * Clamps a number between a minimum and maximum value
 * @param num - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 */
export const clamp = (num: number, min: number, max: number): number => {
  if (max < min) {
    [min, max] = [max, min];
  }
  if (num < min) return min;
  else if (num > max) return max;
  return num;
};
