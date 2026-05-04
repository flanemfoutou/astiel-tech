export const GET_SERVICES = `
  query GetServices($pagination: PaginationInput) {
    listServices(pagination: $pagination) {
      items {
        id
        nom
        description
        categorie
        tarifJournalier
        statut
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

export const GET_SERVICE = `
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      nom
      description
      categorie
      tarifJournalier
      statut
      createdAt
      updatedAt
    }
  }
`;

export const GET_SERVICES_BY_CATEGORY = `
  query GetServicesByCategory($categorie: ServiceCategory!) {
    listServicesByCategorie(categorie: $categorie) {
      id
      nom
      description
      categorie
      tarifJournalier
      statut
    }
  }
`;

export const GET_ACTIVE_SERVICES = `
  query GetActiveServices {
    listServicesActifs {
      id
      nom
      description
      categorie
      tarifJournalier
      statut
    }
  }
`;

export const GET_BLOCKED_SERVICES = `
  query GetBlockedServices {
    listServicesBloques {
      id
      nom
      description
      categorie
      tarifJournalier
      statut
    }
  }
`;

export const CREATE_SERVICE = `
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      nom
      description
      categorie
      tarifJournalier
      statut
    }
  }
`;

export const UPDATE_SERVICE = `
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      nom
      description
      categorie
      tarifJournalier
      statut
    }
  }
`;

export const DELETE_SERVICE = `
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;

export const ACTIVER_SERVICE = `
  mutation ActiverService($id: ID!) {
    activerService(id: $id) {
      id
      statut
    }
  }
`;

export const DESACTIVER_SERVICE = `
  mutation DesactiverService($id: ID!) {
    desactiverService(id: $id) {
      id
      statut
    }
  }
`;

export const BLOQUER_SERVICE = `
  mutation BloquerService($id: ID!) {
    bloquerService(id: $id) {
      id
      statut
    }
  }
`;
