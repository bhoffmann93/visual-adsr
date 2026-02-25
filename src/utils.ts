export const clamp = (num: number, min: number, max: number): number => {
  if (max < min) {
    [min, max] = [max, min];
  }
  if (num < min) return min;
  else if (num > max) return max;
  return num;
};
