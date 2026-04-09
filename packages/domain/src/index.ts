// Entities
export * from './entities/Customer';
export * from './entities/Projet';
export * from './entities/Service';

// Value Objects
export * from './value-objects/Email';
export * from './value-objects/PhoneNumber';
export * from './value-objects/ProjectStatus';

// Repository Interfaces (ports)
export * from './repositories/ICustomerRepository';
export * from './repositories/IProjetRepository';
export * from './repositories/IServiceRepository';

// Use Cases
export * from './use-cases/customer/CreateCustomerUseCase';
export * from './use-cases/customer/GetCustomerUseCase';
export * from './use-cases/customer/ListCustomersUseCase';
export * from './use-cases/customer/UpdateCustomerUseCase';
export * from './use-cases/projet/CreateProjetUseCase';
export * from './use-cases/projet/GetProjetUseCase';
export * from './use-cases/projet/CloturerProjetUseCase';