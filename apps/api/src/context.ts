import { db } from '@astiell/db';
import {
  DrizzleCustomerRepository,
  DrizzleProjectRepository,
  DrizzleServiceRepository,
  DrizzleProjectServiceRepository,
  DrizzleInvoiceRepository,
  DrizzleInvoiceItemRepository,
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
  CreateServiceUseCase,
  GetServiceUseCase,
  ListServicesUseCase,
  UpdateServiceUseCase,
  AddServiceToProjetUseCase,   // ✅ nom correct
  CreateInvoiceUseCase,
  GetInvoiceUseCase,
  ListInvoicesUseCase,
  ChangerStatutInvoiceUseCase,
} from '@astiell/domain';

const customerRepository       = new DrizzleCustomerRepository(db);
const projectRepository        = new DrizzleProjectRepository(db);
const serviceRepository        = new DrizzleServiceRepository(db);
const projectServiceRepository = new DrizzleProjectServiceRepository(db);
const invoiceRepository        = new DrizzleInvoiceRepository(db);
const invoiceItemRepository    = new DrizzleInvoiceItemRepository(db);

export const buildContext = () => ({
  repositories: {
    customer:       customerRepository,
    project:        projectRepository,
    service:        serviceRepository,
    projectService: projectServiceRepository,
    invoice:        invoiceRepository,
    invoiceItem:    invoiceItemRepository,
  },
  useCases: {
    // Customer
    createCustomer:       new CreateCustomerUseCase(customerRepository),
    getCustomer:          new GetCustomerUseCase(customerRepository),
    listCustomers:        new ListCustomersUseCase(customerRepository),
    updateCustomer:       new UpdateCustomerUseCase(customerRepository),

    // Project ✅ ListProjectsUseCase supprimé — listProjects passe par le repository directement
    createProject:        new CreateProjectUseCase(projectRepository),
    getProject:           new GetProjectUseCase(projectRepository),
    updateProject:        new UpdateProjectUseCase(projectRepository),
    deleteProject:        new DeleteProjectUseCase(projectRepository),

    // Service
    createService:        new CreateServiceUseCase(serviceRepository),
    getService:           new GetServiceUseCase(serviceRepository),
    listServices:         new ListServicesUseCase(serviceRepository),
    updateService:        new UpdateServiceUseCase(serviceRepository),

    // ProjectService
    addServiceToProjet:   new AddServiceToProjetUseCase(projectServiceRepository), // ✅

    // Invoice
    createInvoice:        new CreateInvoiceUseCase(invoiceRepository, invoiceItemRepository, projectServiceRepository),
    getInvoice:           new GetInvoiceUseCase(invoiceRepository),
    listInvoices:         new ListInvoicesUseCase(invoiceRepository),
    changerStatutInvoice: new ChangerStatutInvoiceUseCase(invoiceRepository),
  },
});

export type GraphQLContext = ReturnType<typeof buildContext>;