import type { GraphQLContext } from '../../context';
import type { ServiceCategory } from '@astiell/domain';

export const serviceResolvers = {
  Query: {
    service: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.repositories.service.findById(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    servicesByCategorie: async (
      _: unknown,
      { categorie }: { categorie: ServiceCategory },
      ctx: GraphQLContext
    ) => {
      const items = await ctx.repositories.service.findByCategorie(categorie);
      return items.map(s => s.toPlain());
    },

    servicesActifs: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      const items = await ctx.repositories.service.findActifs();
      return items.map(s => s.toPlain());
    },
  },

  Mutation: {
    createService: async (
      _: unknown,
      { input }: { input: { nom: string; description: string; categorie: ServiceCategory; tarifJournalier?: number } },
      ctx: GraphQLContext
    ) => {
      const { Service } = await import('@astiell/domain');
      const service = Service.create({ ...input, actif: true });
      const result = await ctx.repositories.service.save(service);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    desactiverService: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const findResult = await ctx.repositories.service.findById(id);
      if (!findResult.success) throw new Error(findResult.error.message);
      const desactive = findResult.value.desactiver();
      const saveResult = await ctx.repositories.service.save(desactive);
      if (!saveResult.success) throw new Error(saveResult.error.message);
      return saveResult.value.toPlain();
    },
  },
};