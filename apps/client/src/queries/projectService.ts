// src/queries/projectService.ts

import { gql } from 'graphql-request';

export const LIST_SERVICES_BY_PROJET = gql`
  query ListServicesByProjet($projetId: ID!) {
    listServicesByProjet(projetId: $projetId) {
      id
      projetId
      serviceId
      quantite
      prixUnitaire
      montantTotal
    }
  }
`;

export const ADD_SERVICE_TO_PROJET = gql`
  mutation AddServiceToProjet($input: AddServiceToProjetInput!) {
    addServiceToProjet(input: $input) {
      id
      projetId
      serviceId
      quantite
      prixUnitaire
      montantTotal
    }
  }
`;

export const REMOVE_SERVICE_FROM_PROJET = gql`
  mutation RemoveServiceFromProjet($id: ID!) {
    removeServiceFromProjet(id: $id)
  }
`;