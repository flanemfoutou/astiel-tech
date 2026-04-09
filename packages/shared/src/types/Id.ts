export type Id = string;

export function generateId(): Id {
  return crypto.randomUUID();
}