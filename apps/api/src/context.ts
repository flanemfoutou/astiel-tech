import { db } from '@astiell/db';
import {
  DrizzleCustomerRepository,
  DrizzleProjetRepository,
  DrizzleServiceRepository,
} from '@astiell/db';
import {
  CreateCustomerUseCase,
  GetCustomerUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
  CreateProjetUseCase,
  GetProjetUseCase,
  CloturerProjetUseCase,
} from '@astiell/domain';

const customerRepository = new DrizzleCustomerRepository(db);
const projetRepository = new DrizzleProjetRepository(db);
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
    createProjet: new CreateProjetUseCase(projetRepository),
    getProjet: new GetProjetUseCase(projetRepository),
    cloturerProjet: new CloturerProjetUseCase(projetRepository),
  },
});

export type GraphQLContext = ReturnType<typeof buildContext>;