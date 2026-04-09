import type { GraphQLContext } from '../../context';

export const projetResolvers = {
  Query: {
    projet: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.useCases.getProjet.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    projetsByClient: async (
      _: unknown,
      { clientId }: { clientId: string },
      ctx: GraphQLContext
    ) => {
      const projets = await ctx.repositories.projet.findByClientId(clientId);
      return projets.map(p => p.toPlain());
    },
  },

  Mutation: {
    createProjet: async (
      _: unknown,
      { input }: { input: { titre: string; description: string; clientId: string; dateDebut: string; statut?: string } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.createProjet.execute({
        ...input,
        dateDebut: new Date(input.dateDebut),
      });
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    cloturerProjet: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const findResult = await ctx.repositories.projet.findById(id);
      if (!findResult.success) throw new Error(findResult.error.message);

      const cloture = findResult.value.cloturer();
      const saveResult = await ctx.repositories.projet.save(cloture);
      if (!saveResult.success) throw new Error(saveResult.error.message);

      return saveResult.value.toPlain();
    },
  },
};