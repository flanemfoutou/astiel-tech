export const projetTypeDefs = /* GraphQL */ `
  enum ProjectStatus {
    EN_ATTENTE
    EN_COURS
    TERMINE
    ANNULE
  }

  type Projet {
    id: ID!
    titre: String!
    description: String!
    statut: ProjectStatus!
    clientId: ID!
    dateDebut: String!
    dateFin: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateProjetInput {
    titre: String!
    description: String!
    clientId: ID!
    dateDebut: String!
    statut: ProjectStatus
  }

  extend type Query {
    projet(id: ID!): Projet
    projetsByClient(clientId: ID!): [Projet!]!
  }

  extend type Mutation {
    createProjet(input: CreateProjetInput!): Projet!
    cloturerProjet(id: ID!): Projet!
  }
`;