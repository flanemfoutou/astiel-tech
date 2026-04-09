export type Result<T, E extends Error = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  success: true,
  value,
});

export const err = <E extends Error>(error: E): Result<never, E> => ({
  success: false,
  error,
});