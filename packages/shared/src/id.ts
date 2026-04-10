import { randomUUID } from 'crypto';

export type Id = string;

export function generateId(prefix: string): Id {
  return `${prefix}_${randomUUID()}`;
}