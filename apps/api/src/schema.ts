import { makeExecutableSchema } from '@graphql-tools/schema';
import { customerTypeDefs } from './modules/customer/customer.schema';
import { projectTypeDefs } from './modules/project/project.schema';
import { serviceTypeDefs } from './modules/service/service.schema';
import { projectServiceTypeDefs } from './modules/projectService/projectService.schema';
import { invoiceTypeDefs } from './modules/invoice/invoice.schema';
import { customerResolvers } from './modules/customer/customer.resolver';
import { projectResolvers } from './modules/project/project.resolver';
import { serviceResolvers } from './modules/service/service.resolver';
import { projectServiceResolvers } from './modules/projectService/projectService.resolver';
import { invoiceResolvers } from './modules/invoice/invoice.resolver';

const rootTypeDefs = /* GraphQL */ `
  type Query { _empty: String }
  type Mutation { _empty: String }
`;

export const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, customerTypeDefs, projectTypeDefs, serviceTypeDefs, projectServiceTypeDefs, invoiceTypeDefs],
  resolvers: [customerResolvers, projectResolvers, serviceResolvers, projectServiceResolvers, invoiceResolvers],
});