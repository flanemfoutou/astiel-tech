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
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '@astiell/domain';

const customerRepository = new DrizzleCustomerRepository(db);
const projectRepository = new DrizzleProjectRepository(db);
const serviceRepository = new DrizzleServiceRepository(db);

export const buildContext = () => ({
  repositories: {
    customer: customerRepository,
    project: projectRepository,
    service: serviceRepository,
  },
  useCases: {
    createCustomer: new CreateCustomerUseCase(customerRepository),
    getCustomer: new GetCustomerUseCase(customerRepository),
    listCustomers: new ListCustomersUseCase(customerRepository),
    updateCustomer: new UpdateCustomerUseCase(customerRepository),
    createProject: new CreateProjectUseCase(projectRepository),
    getProject: new GetProjectUseCase(projectRepository),
    updateProject: new UpdateProjectUseCase(projectRepository),
    deleteProject: new DeleteProjectUseCase(projectRepository),
  },
});

export type GraphQLContext = ReturnType<typeof buildContext>;