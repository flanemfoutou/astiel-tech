export const projectTypeDefs = /* GraphQL */ `
  enum ProjectStatus {
    EN_ATTENTE
    EN_COURS
    TERMINE
    ANNULE
  }

  type Project {
    id: ID!
    title: String!
    description: String
    status: ProjectStatus!
    customerId: ID!
    customer: Customer
    startDate: String!
    endDate: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateProjectInput {
    title: String
    description: String
    status: ProjectStatus
    customerId: ID
    startDate: String
    endDate: String
  }

  input UpdateProjectInput {
    title: String
    description: String
    status: ProjectStatus
    endDate: String
  }

  extend type Query {
    getProject(id: ID!): Project
    listProjects: [Project!]!
    listProjectsByCustomer(customerId: ID!): [Project!]!
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;