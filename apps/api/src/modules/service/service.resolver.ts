import type { GraphQLContext } from '../../context';
import type { ServiceCategory } from '@astiell/domain';

export const serviceResolvers = {
  Query: {
    getService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) throw new Error('You must provide a service ID');
      const result = await ctx.repositories.service.findById(id);
      if (!result.success) throw new Error(`No service found with ID "${id}"`);
      return result.value.toPlain();
    },

    listServices: async (
      _: unknown,
      { pagination }: { pagination?: { page?: number; limit?: number } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.repositories.service.findAll(pagination);
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
      if (!input.nom?.trim()) throw new Error('"nom" is required');
      if (!input.description?.trim()) throw new Error('"description" is required');
      if (!input.categorie) throw new Error('"categorie" is required');

      const { Service } = await import('@astiell/domain');
      const service = Service.create({ ...input, statut: 'ACTIF' });
      const result = await ctx.repositories.service.save(service);
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
      if (!id?.trim()) throw new Error('"id" is required to update a service');
      const findResult = await ctx.repositories.service.findById(id);
      if (!findResult.success) throw new Error(`No service found with ID "${id}"`);
      const updated = findResult.value.mettreAJour(input);
      const saveResult = await ctx.repositories.service.save(updated);
      if (!saveResult.success) throw new Error(saveResult.error.message);
      return saveResult.value.toPlain();
    },

    deleteService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) throw new Error('"id" is required to delete a service');
      const result = await ctx.repositories.service.delete(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },

    // ✅ Activer
    activerService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) throw new Error('"id" is required');
      const findResult = await ctx.repositories.service.findById(id);
      if (!findResult.success) throw new Error(`No service found with ID "${id}"`);
      const activated = findResult.value.activer();
      const saveResult = await ctx.repositories.service.save(activated);
      if (!saveResult.success) throw new Error(saveResult.error.message);
      return saveResult.value.toPlain();
    },

    // ✅ Désactiver
    desactiverService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) throw new Error('"id" is required');
      const findResult = await ctx.repositories.service.findById(id);
      if (!findResult.success) throw new Error(`No service found with ID "${id}"`);
      const deactivated = findResult.value.desactiver();
      const saveResult = await ctx.repositories.service.save(deactivated);
      if (!saveResult.success) throw new Error(saveResult.error.message);
      return saveResult.value.toPlain();
    },

    // ✅ Bloquer
    bloquerService: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) throw new Error('"id" is required');
      const findResult = await ctx.repositories.service.findById(id);
      if (!findResult.success) throw new Error(`No service found with ID "${id}"`);
      const blocked = findResult.value.bloquer();
      const saveResult = await ctx.repositories.service.save(blocked);
      if (!saveResult.success) throw new Error(saveResult.error.message);
      return saveResult.value.toPlain();
    },
  },
};