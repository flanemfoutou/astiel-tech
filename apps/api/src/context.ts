import { db } from '@astiell/db';
import {
  DrizzleCustomerRepository,
  DrizzleProjectRepository,
  DrizzleServiceRepository,
} from '@astiell/db';
import {
  CreateCustomerUseCase,
  GetCustomerUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
  CreateProjectUseCase,
  GetProjectUseCase,
  CloturerProjectUseCase,
  CreateServiceUseCase,
  GetServiceUseCase,
  ListServicesUseCase,
  UpdateServiceUseCase,
} from '@astiell/domain';

const customerRepository = new DrizzleCustomerRepository(db);
const projetRepository = new DrizzleProjectRepository(db);
const serviceRepository = new DrizzleServiceRepository(db);

export const buildContext = () => ({
  repositories: {
    customer: customerRepository,
    projet: projetRepository,
    service: serviceRepository,
  },
  useCases: {
    createCustomer: new CreateCustomerUseCase(customerRepository),
    getCustomer: new GetCustomerUseCase(customerRepository),
    listCustomers: new ListCustomersUseCase(customerRepository),
    updateCustomer: new UpdateCustomerUseCase(customerRepository),
    createProjet: new CreateProjectUseCase(projetRepository),
    getProjet: new GetProjectUseCase(projetRepository),
    cloturerProjet: new CloturerProjectUseCase(projetRepository),
    createService: new CreateServiceUseCase(serviceRepository),
    getService: new GetServiceUseCase(serviceRepository),
    listServices: new ListServicesUseCase(serviceRepository),
    updateService: new UpdateServiceUseCase(serviceRepository),
  },
});

export type GraphQLContext = ReturnType<typeof buildContext>;