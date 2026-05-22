export const invoiceTypeDefs = /* GraphQL */ `
  enum InvoiceStatus {
    BROUILLON
    ENVOYEE
    PAYEE
    ANNULEE
  }

  enum ActionStatut {
    ENVOYER
    PAYER
    ANNULER
  }

  type InvoiceItem {
    id: ID!
    invoiceId: ID!
    projectServiceId: ID!
    designation: String!
    quantite: Int!
    prixUnitaire: Int!
    montantTotal: Int!
    createdAt: String!
  }

  type Invoice {
    id: ID!
    numero: String!
    reference: String
    idClient: String
    description: String
    projetId: ID!
    customerId: ID!
    statut: InvoiceStatus!
    dateEmission: String!
    dateEcheance: String!
    montantHT: Int!
    tauxTVA: Float!
    montantTVA: Int!
    montantTTC: Int!
    notes: String
    items: [InvoiceItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedInvoices {
    items: [Invoice!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CreateInvoiceInput {
    projetId: ID!
    customerId: ID!
    dateEcheance: String!
    tauxTVA: Float!
    notes: String
    reference: String
    idClient: String
    description: String
  }

  extend type Query {
    getInvoice(id: ID!): Invoice
    listInvoices(pagination: PaginationInput): PaginatedInvoices!
    listInvoicesByProjet(projetId: ID!): [Invoice!]!
    listInvoicesByCustomer(customerId: ID!): [Invoice!]!
  }

  extend type Mutation {
    createInvoice(input: CreateInvoiceInput!): Invoice!
    changerStatutInvoice(id: ID!, action: ActionStatut!): Invoice!
    deleteInvoice(id: ID!): Boolean!
  }
`;