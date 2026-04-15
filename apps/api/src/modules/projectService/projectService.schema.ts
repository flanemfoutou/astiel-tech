export const projectServiceTypeDefs = /* GraphQL */ `
  type ProjectService {
    id: ID!
    projetId: ID!
    serviceId: ID!
    quantite: Int!
    prixUnitaire: Int!
    montantTotal: Int!
    createdAt: String!
    updatedAt: String!
  }

  input AddServiceToProjetInput {
    projetId: ID!
    serviceId: ID!
    quantite: Int!
    prixUnitaire: Int!
  }

  extend type Query {
    listServicesByProjet(projetId: ID!): [ProjectService!]!
  }

  extend type Mutation {
    addServiceToProjet(input: AddServiceToProjetInput!): ProjectService!
    removeServiceFromProjet(id: ID!): Boolean!
  }
`;