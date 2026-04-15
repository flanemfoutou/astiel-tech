import type { GraphQLContext } from '../../context';
import type { ActionStatut } from '@astiell/domain';

export const invoiceResolvers = {
  Query: {
    getInvoice: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.useCases.getInvoice.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    listInvoices: async (
      _: unknown,
      { pagination }: { pagination?: { page?: number; limit?: number } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.listInvoices.execute(pagination);
      return { ...result, items: result.items.map(i => i.toPlain()) };
    },

    listInvoicesByProjet: async (_: unknown, { projetId }: { projetId: string }, ctx: GraphQLContext) => {
      const items = await ctx.repositories.invoice.findByProjetId(projetId);
      return items.map(i => i.toPlain());
    },

    listInvoicesByCustomer: async (_: unknown, { customerId }: { customerId: string }, ctx: GraphQLContext) => {
      const items = await ctx.repositories.invoice.findByCustomerId(customerId);
      return items.map(i => i.toPlain());
    },
  },

  Mutation: {
    createInvoice: async (
      _: unknown,
      { input }: { input: { projetId: string; customerId: string; dateEcheance: string; tauxTVA: number; notes?: string } },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.createInvoice.execute({
        ...input,
        dateEcheance: new Date(input.dateEcheance),
      });
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    changerStatutInvoice: async (
      _: unknown,
      { id, action }: { id: string; action: ActionStatut },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.changerStatutInvoice.execute(id, action);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    deleteInvoice: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.repositories.invoice.delete(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },
  },

  // Résolveur pour charger les items d'une invoice
  Invoice: {
    items: async (parent: { id: string }, _: unknown, ctx: GraphQLContext) => {
      const items = await ctx.repositories.invoiceItem.findByInvoiceId(parent.id);
      return items.map(i => i.toPlain());
    },
  },
};