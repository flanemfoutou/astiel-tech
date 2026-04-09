export const serviceTypeDefs = /* GraphQL */ `
  enum ServiceCategory {
    TIC
    GENIE_CIVIL
    LOGISTIQUE
    COMMERCE
    FOURNITURE
  }

  type Service {
    id: ID!
    nom: String!
    description: String!
    categorie: ServiceCategory!
    tarifJournalier: Int
    actif: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateServiceInput {
    nom: String!
    description: String!
    categorie: ServiceCategory!
    tarifJournalier: Int
  }

  extend type Query {
    service(id: ID!): Service
    servicesByCategorie(categorie: ServiceCategory!): [Service!]!
    servicesActifs: [Service!]!
  }

  extend type Mutation {
    createService(input: CreateServiceInput!): Service!
    desactiverService(id: ID!): Service!
  }
`;