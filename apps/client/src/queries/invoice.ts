import { gql } from 'graphql-request';

export const GET_INVOICES = gql`
  query ListInvoices($pagination: PaginationInput) {
    listInvoices(pagination: $pagination) {
      items {
        id
        numero
        reference
        idClient
        description
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
      total
      page
      limit
      totalPages
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      numero
      reference
      idClient
      description
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

export const CHANGER_STATUT_INVOICE = gql`
  mutation ChangerStatutInvoice($id: ID!, $action: ActionStatut!) {
    changerStatutInvoice(id: $id, action: $action) {
      id
      numero
      statut
    }
  }
`;

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;