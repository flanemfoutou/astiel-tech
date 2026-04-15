import type { GraphQLContext } from '../../context';

export const projectServiceResolvers = {
  Query: {
    listServicesByProjet: async (_: unknown, { projetId }: { projetId: string }, ctx: GraphQLContext) => {
      const items = await ctx.repositories.projectService.findByProjetId(projetId);
      return items.map(ps => ({ ...ps.toPlain(), montantTotal: ps.montantTotal }));
    },
  },

  Mutation: {
    addServiceToProjet: async (
      _: unknown,
      { input }: { input: { projetId: string; serviceId: string; quantite: number; prixUnitaire: number } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.addServiceToProjet.execute(input);
      if (!result.success) throw new Error(result.error.message);
      return { ...result.value.toPlain(), montantTotal: result.value.montantTotal };
    },

    removeServiceFromProjet: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.repositories.projectService.delete(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },
  },
};