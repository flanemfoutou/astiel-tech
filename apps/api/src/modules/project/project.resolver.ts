import type { GraphQLContext } from '../../context';

const formatDate = (value: Date | string | number | null | undefined): string | null => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

const formatProject = (plain: Record<string, any>) => ({
  ...plain,
  startDate: formatDate(plain.startDate),
  endDate: formatDate(plain.endDate),
  createdAt: formatDate(plain.createdAt),
  updatedAt: formatDate(plain.updatedAt),
});

// ✅ Valide et parse une date — retourne null si invalide
const parseDate = (value: string | undefined | null): Date | null => {
  if (!value?.trim()) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
};

export const projectResolvers = {
  Query: {
    listProjects: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      const projects = await ctx.repositories.project.findAll();
      return projects.map(p => formatProject(p.toPlain()));
    },

    getProject: async (
      _: unknown,
      { id }: { id?: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) {
        throw new Error('You must provide a project ID');
      }

      const result = await ctx.useCases.getProject.execute(id);
      if (!result.success) {
        throw new Error(`No project found with ID "${id}"`);
      }

      return formatProject(result.value.toPlain());
    },

    listProjectsByCustomer: async (
      _: unknown,
      { customerId }: { customerId: string },
      ctx: GraphQLContext
    ) => {
      const projects = await ctx.repositories.project.findByCustomerId(customerId);
      return projects.map(p => formatProject(p.toPlain()));
    },
  },

  Project: {
    customer: async (
      parent: { customerId: string },
      _: unknown,
      ctx: GraphQLContext
    ) => {
      const result = await ctx.useCases.getCustomer.execute(parent.customerId);
      if (!result.success) return null;
      return result.value.toPlain();
    },
  },

  Mutation: {
    createProject: async (
      _: unknown,
      { input }: {
        input: {
          title?: string;
          description?: string;
          status?: string;
          customerId?: string;
          startDate?: string;
          endDate?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      // ✅ Validation des champs obligatoires dans le resolver
      const errors: string[] = [];

      if (!input.title?.trim())       errors.push('"title" is required');
      if (!input.description?.trim()) errors.push('"description" is required');
      if (!input.customerId?.trim())  errors.push('"customerId" is required');
      if (!input.status?.trim())      errors.push('"status" is required');

      if (!input.startDate?.trim()) {
        errors.push('"startDate" is required');
      } else if (!parseDate(input.startDate)) {
        errors.push('"startDate" must be a valid date (e.g. "2026-01-15")');
      }

      if (input.endDate?.trim() && !parseDate(input.endDate)) {
        errors.push('"endDate" must be a valid date (e.g. "2026-06-30")');
      }

      if (errors.length > 0) {
        throw new Error(
          `Please fill in the following required fields:\n${errors.map(e => `  • ${e}`).join('\n')}`
        );
      }

      const result = await ctx.useCases.createProject.execute({
        title: input.title!,
        description: input.description!,
        customerId: input.customerId!,
        status: input.status as any,
        startDate: parseDate(input.startDate)!,
        endDate: parseDate(input.endDate!) ?? undefined,
      });

      if (!result.success) throw new Error(result.error.message);
      return formatProject(result.value.toPlain());
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
      if (!id?.trim()) {
        throw new Error('"id" is required to update a project');
      }

      if (input.endDate?.trim() && !parseDate(input.endDate)) {
        throw new Error('"endDate" must be a valid date (e.g. "2026-06-30")');
      }

      const result = await ctx.useCases.updateProject.execute({
        id,
        ...input,
        endDate: parseDate(input.endDate ?? null) ?? undefined,
      });

      if (!result.success) throw new Error(result.error.message);
      return formatProject(result.value.toPlain());
    },

    deleteProject: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      if (!id?.trim()) {
        throw new Error('"id" is required to delete a project');
      }

      const result = await ctx.useCases.deleteProject.execute(id);
      if (!result.success) throw new Error(result.error.message);
      return true;
    },
  },
};