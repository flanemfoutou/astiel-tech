import type { GraphQLContext } from '../../context';

export const projectResolvers = {
  Query: {
    projects: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      const projects = await ctx.repositories.project.findAll();
      return projects.map(p => p.toPlain());
    },

    project: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.useCases.getProject.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    projectsByCustomer: async (
      _: unknown,
      { customerId }: { customerId: string },
      ctx: GraphQLContext
    ) => {
      const projects = await ctx.repositories.project.findByCustomerId(customerId);
      return projects.map(p => p.toPlain());
    },
  },

  Mutation: {
    createProject: async (
      _: unknown,
      { input }: {
        input: {
          title: string;
          description?: string;
          status: string;
          customerId: string;
          startDate: string;
          endDate?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.createProject.execute({
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      });
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    updateProject: async (
      _: unknown,
      { id, input }: {
        id: string;
        input: {
          title?: string;
          description?: string;
          status?: string;
          endDate?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.updateProject.execute({
        id,
        ...input,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      });
      if (!result.success) throw new Error(result.error.message);
      return result.value.toPlain();
    },

    deleteProject: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await ctx.useCases.deleteProject.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },
  },
};