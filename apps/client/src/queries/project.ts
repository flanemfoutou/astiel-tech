export const GET_PROJECTS = `
  query GetProjects {
    listProjects {
      id
      title
      description
      status
      customerId
      customer {
        id
        nomComplet
        entreprise
      }
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = `
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      title
      description
      status
      customerId
      customer {
        id
        nomComplet
        entreprise
      }
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECTS_BY_CUSTOMER = `
  query GetProjectsByCustomer($customerId: ID!) {
    listProjectsByCustomer(customerId: $customerId) {
      id
      title
      description
      status
      startDate
      endDate
    }
  }
`;

export const CREATE_PROJECT = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      status
      customerId
      startDate
      endDate
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      description
      status
      endDate
    }
  }
`;

export const DELETE_PROJECT = `
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
