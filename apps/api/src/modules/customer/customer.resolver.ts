import type { GraphQLContext } from '../../context';

export const customerResolvers = {
  Query: {
    getCustomer: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.useCases.getCustomer.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    listCustomers: async (
      _: unknown,
      { pagination }: { pagination?: { page?: number; limit?: number } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.listCustomers.execute(pagination);
      return {
        ...result,
        items: result.items.map(c => c.toPlain()),
      };
    },
  },

  Mutation: {
    createCustomer: async (
      _: unknown,
      { input }: {
        input: {
          nom: string;
          prenom: string;
          email: string;
          telephone: string;
          entreprise?: string;
          adresse?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.createCustomer.execute(input);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    updateCustomer: async (
      _: unknown,
      { id, input }: {
        id: string;
        input: { nom?: string; prenom?: string; entreprise?: string; adresse?: string };
      },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.updateCustomer.execute({ id, ...input });
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    deleteCustomer: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.repositories.customer.delete(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },
  },

  Customer: {
    nomComplet: (parent: { prenom: string; nom: string }) =>
      `${parent.prenom} ${parent.nom}`,
  },
};