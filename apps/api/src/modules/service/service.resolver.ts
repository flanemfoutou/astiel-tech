import type { GraphQLContext } from '../../context';
import type { ServiceCategory } from '@astiell/domain';

export const serviceResolvers = {
  Query: {
    getService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.getService.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    listServices: async (
      _: unknown,
      { pagination }: { pagination?: { page?: number; limit?: number } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.listServices.execute(pagination);
      return {
        ...result,
        items: result.items.map(s => s.toPlain()),
      };
    },

    listServicesByCategorie: async (
      _: unknown,
      { categorie }: { categorie: ServiceCategory },
      ctx: GraphQLContext
    ) => {
      const items = await ctx.repositories.service.findByCategorie(categorie);
      return items.map(s => s.toPlain());
    },

    listServicesActifs: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      const items = await ctx.repositories.service.findActifs();
      return items.map(s => s.toPlain());
    },

    listServicesDesActifs: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      const items = await ctx.repositories.service.findInactifs();
      return items.map(s => s.toPlain());
    },

    listServicesBloques: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      const items = await ctx.repositories.service.findBloques();
      return items.map(s => s.toPlain());
    },
  },

  Mutation: {
    createService: async (
      _: unknown,
      { input }: {
        input: {
          nom: string;
          description: string;
          categorie: ServiceCategory;
          tarifJournalier?: number;
        };
      },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.createService.execute(input);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    updateService: async (
      _: unknown,
      { id, input }: {
        id: string;
        input: {
          nom?: string;
          description?: string;
          categorie?: ServiceCategory;
          tarifJournalier?: number;
        };
      },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.updateService.execute({ id, ...input });
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    deleteService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.repositories.service.delete(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },

    activerService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.activerService.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    desactiverService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.desactiverService.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    bloquerService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.bloquerService.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },
  },
};