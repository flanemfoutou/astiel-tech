import { ValidationError } from '@astiell/shared';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    const trimmed = raw.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new ValidationError(`Email invalide : "${raw}"`, 'email');
    }
    return new Email(trimmed);
  }

  toString(): string {
    return this.value;
  }
}