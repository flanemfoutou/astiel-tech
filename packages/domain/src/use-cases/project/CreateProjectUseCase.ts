import type { IProjectRepository } from '../../repositories/IProjectRepository';
import { Project } from '../../entities/Project';
import { err, ValidationError, type Result } from '@astiell/shared';
import type { ProjectStatus } from '../../value-objects/ProjectStatus';

export interface CreateProjectInput {
  title: string;
  description?: string;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  status?: ProjectStatus;
}

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Result<Project>> {
    try {
      // ── 1. Date validation ────────────────────────────────────────────────
      const startDate = new Date(input.startDate);
      if (isNaN(startDate.getTime())) {
        return err(new ValidationError('The startDate is not a valid date', 'startDate'));
      }

      if (input.endDate) {
        const endDate = new Date(input.endDate);
        if (isNaN(endDate.getTime())) {
          return err(new ValidationError('The endDate is not a valid date', 'endDate'));
        }
        if (endDate <= startDate) {
          return err(new ValidationError('The endDate must be after the startDate', 'endDate'));
        }
      }

      // ── 2. Customer exists in DB ──────────────────────────────────────────
      const customerExists = await this.projectRepository.existsCustomer(input.customerId);
      if (!customerExists) {
        return err(
          new ValidationError(
            `No customer found with ID "${input.customerId}". Please provide a valid customer ID.`,
            'customerId'
          )
        );
      }

      // ── 3. No duplicate title for same customer ───────────────────────────
      const projectExists = await this.projectRepository.existsByCustomerAndTitle(
        input.customerId,
        input.title
      );
      if (projectExists) {
        return err(
          new ValidationError(
            `Customer "${input.customerId}" already has a project titled "${input.title}".`,
            'title'
          )
        );
      }

      // ── 4. Create ─────────────────────────────────────────────────────────
      const project = Project.create({
        ...input,
        startDate,
        status: input.status ?? 'EN_ATTENTE',
      });

      return await this.projectRepository.save(project);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}