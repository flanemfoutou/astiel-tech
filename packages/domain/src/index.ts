// Entities
export * from './entities/Customer';
export * from './entities/Project';  // ✅ Projet → Project
export * from './entities/Service';

// Value Objects
export * from './value-objects/Email';
export * from './value-objects/PhoneNumber';
export * from './value-objects/ProjectStatus';

// Repository Interfaces (ports)
export * from './repositories/ICustomerRepository';
export * from './repositories/IProjectRepository';
export * from './repositories/IServiceRepository';

// Use Cases - Customer
export * from './use-cases/customer/CreateCustomerUseCase';
export * from './use-cases/customer/GetCustomerUseCase';
export * from './use-cases/customer/ListCustomersUseCase';
export * from './use-cases/customer/UpdateCustomerUseCase';

// Use Cases - Project ✅ projet → project
export * from './use-cases/project/CreateProjectUseCase';
export * from './use-cases/project/GetProjectUseCase';
export * from './use-cases/project/UpdateProjectUseCase';
export * from './use-cases/project/DeleteProjectUseCase';