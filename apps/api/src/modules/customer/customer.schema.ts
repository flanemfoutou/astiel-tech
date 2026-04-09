export const customerTypeDefs = /* GraphQL */ `
  type Customer {
    id: ID!
    nom: String!
    prenom: String!
    nomComplet: String!
    email: String!
    telephone: String!
    entreprise: String
    adresse: String
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedCustomers {
    items: [Customer!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CreateCustomerInput {
    nom: String!
    prenom: String!
    email: String!
    telephone: String!
    entreprise: String
    adresse: String
  }

  input UpdateCustomerInput {
    nom: String
    prenom: String
    entreprise: String
    adresse: String
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  extend type Query {
    getCustomer(id: ID!): Customer
    listCustomers(pagination: PaginationInput): PaginatedCustomers!
  }

  extend type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer!
    updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer!
    deleteCustomer(id: ID!): Boolean!
  }
`;