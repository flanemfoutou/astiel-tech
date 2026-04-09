import { ValidationError } from '@astiell/shared';

export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  // Format congolais : +242 XX XXX XX XX
  static create(raw: string): PhoneNumber {
    const digits = raw.replace(/\s+/g, '');
    if (!/^\+?242\d{8,9}$/.test(digits)) {
      throw new ValidationError(
        `Numéro de téléphone invalide : "${raw}". Format attendu : +242XXXXXXXXX`,
        'phoneNumber'
      );
    }
    return new PhoneNumber(digits.startsWith('+') ? digits : `+${digits}`);
  }

  toString(): string {
    return this.value;
  }
}