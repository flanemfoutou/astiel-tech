export const serviceTypeDefs = /* GraphQL */ `
  enum ServiceNom {
    DEVELOPPEMENT_APP_WEB_MOBILE
    MAINTENANCE_INFORMATIQUE_BUREAUTIQUE
    CONNEXION_INTERNET_RESEAUX
    VIDEOSURVEILLANCE_CCTV
    CONTROLE_ACCES
    FOURNITURE_EQUIPEMENTS_INFORMATIQUES
    FOURNITURE_CONSOMMABLES_TELECOM
  }

  enum ServiceCategory {
    TIC
    GENIE_CIVIL
    LOGISTIQUE
    COMMERCE
    FOURNITURE
  }

  enum ServiceStatus {
    ACTIF
    INACTIF
    BLOQUE
  }

  type Service {
    id: ID!
    nom: ServiceNom!
    description: String!
    categorie: ServiceCategory!
    tarifJournalier: Int
    statut: ServiceStatus!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedServices {
    items: [Service!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CreateServiceInput {
    nom: ServiceNom!
    description: String!
    categorie: ServiceCategory!
    tarifJournalier: Int
  }

  input UpdateServiceInput {
    nom: ServiceNom
    description: String
    categorie: ServiceCategory
    tarifJournalier: Int
  }

  extend type Query {
    getService(id: ID!): Service
    listServices(pagination: PaginationInput): PaginatedServices!
    listServicesByCategorie(categorie: ServiceCategory!): [Service!]!
    listServicesActifs: [Service!]!
    listServicesDesActifs: [Service!]!
    listServicesBloques: [Service!]!
  }

  extend type Mutation {
    createService(input: CreateServiceInput!): Service!
    updateService(id: ID!, input: UpdateServiceInput!): Service!
    deleteService(id: ID!): Boolean!
    activerService(id: ID!): Service!
    desactiverService(id: ID!): Service!
    bloquerService(id: ID!): Service!
  }
`;