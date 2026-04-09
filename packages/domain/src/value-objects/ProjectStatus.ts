export const PROJECT_STATUS = {
  EN_ATTENTE: 'EN_ATTENTE',
  EN_COURS: 'EN_COURS',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
} as const;

export type ProjectStatus = keyof typeof PROJECT_STATUS;