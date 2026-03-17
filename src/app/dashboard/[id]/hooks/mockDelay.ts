export function resolveWithMockDelay<T>(
  value: T,
  delayMs = 2000,
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}
