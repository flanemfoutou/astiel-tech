export const GET_CUSTOMERS = `
  query GetCustomers($pagination: PaginationInput) {
    listCustomers(pagination: $pagination) {
      items {
        id
        nom
        prenom
        nomComplet
        email
        telephone
        entreprise
        adresse
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_CUSTOMER = `
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      nom
      prenom
      nomComplet
      email
      telephone
      entreprise
      adresse
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CUSTOMER = `
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      nom
      prenom
      nomComplet
      email
      telephone
      entreprise
      adresse
    }
  }
`;

export const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      nom
      prenom
      nomComplet
      email
      telephone
      entreprise
      adresse
    }
  }
`;

export const DELETE_CUSTOMER = `
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`;
