// Entities
export * from './entities/Customer';
export * from './entities/Project';
export * from './entities/Service';

// Value Objects
export * from './value-objects/Email';
export * from './value-objects/PhoneNumber';
export * from './value-objects/ProjectStatus';

// Repository Interfaces
export * from './repositories/ICustomerRepository';
export * from './repositories/IProjectRepository';
export * from './repositories/IServiceRepository';

// Use Cases — Customer
export * from './use-cases/customer/CreateCustomerUseCase';
export * from './use-cases/customer/GetCustomerUseCase';
export * from './use-cases/customer/ListCustomersUseCase';
export * from './use-cases/customer/UpdateCustomerUseCase';

// Use Cases — Projet
export * from './use-cases/project/CreateProjectUseCase';
export * from './use-cases/project/GetProjectUseCase';
export * from './use-cases/project/CloturerProjectUseCase';

// Use Cases — Service
export * from './use-cases/service/CreateServiceUseCase';
export * from './use-cases/service/GetServiceUseCase';
export * from './use-cases/service/ListServicesUseCase';
export * from './use-cases/service/UpdateServiceUseCase';