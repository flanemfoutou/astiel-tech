export const GET_INVOICES = `
  query GetInvoices($pagination: PaginationInput) {
    listInvoices(pagination: $pagination) {
      items {
        id
        numero
        projetId
        customerId
        statut
        dateEmission
        dateEcheance
        montantHT
        tauxTVA
        montantTVA
        montantTTC
        notes
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

export const GET_INVOICE = `
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
      id
      numero
      projetId
      customerId
      statut
      dateEmission
      dateEcheance
      montantHT
      tauxTVA
      montantTVA
      montantTTC
      notes
      items {
        id
        designation
        quantite
        prixUnitaire
        montantTotal
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVOICES_BY_PROJECT = `
  query GetInvoicesByProject($projetId: ID!) {
    listInvoicesByProjet(projetId: $projetId) {
      id
      numero
      statut
      dateEmission
      dateEcheance
      montantTTC
    }
  }
`;

export const GET_INVOICES_BY_CUSTOMER = `
  query GetInvoicesByCustomer($customerId: ID!) {
    listInvoicesByCustomer(customerId: $customerId) {
      id
      numero
      statut
      dateEmission
      dateEcheance
      montantTTC
    }
  }
`;

export const CREATE_INVOICE = `
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      numero
      projetId
      customerId
      statut
      dateEmission
      dateEcheance
      montantHT
      tauxTVA
      montantTVA
      montantTTC
      notes
    }
  }
`;

export const CHANGER_STATUT_INVOICE = `
  mutation ChangerStatutInvoice($id: ID!, $action: ActionStatut!) {
    changerStatutInvoice(id: $id, action: $action) {
      id
      statut
    }
  }
`;

export const DELETE_INVOICE = `
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;
