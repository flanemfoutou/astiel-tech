export { db } from './connection';
export * from './schema/customers';
export * from './schema/projects';

// ✅ Named exports only — avoids conflict with @astiell/domain exports (SERVICE_CATEGORIES, SERVICE_NOMS, etc.)
export {
  serviceCategoryEnum,
  serviceStatusEnum,
  serviceNomEnum,
  services,
  type ServiceRow,
  type NewServiceRow,
} from './schema/services';

export * from './schema/projectServices';
export * from './schema/invoices';
export * from './schema/invoiceItems';
export { DrizzleCustomerRepository } from './repositories/DrizzleCustomerRepository';
export { DrizzleProjectRepository } from './repositories/DrizzleProjectRepository';
export { DrizzleServiceRepository } from './repositories/DrizzleServiceRepository';
export { DrizzleProjectServiceRepository } from './repositories/DrizzleProjectServiceRepository';
export { DrizzleInvoiceRepository } from './repositories/DrizzleInvoiceRepository';
export { DrizzleInvoiceItemRepository } from './repositories/DrizzleInvoiceItemRepository';