import type { IProjectRepository } from '../../repositories/IProjectRepository';
import { Project } from '../../entities/Project';
import { err, ValidationError, type Result } from '@astiell/shared';
import type { ProjectStatus } from '../../value-objects/ProjectStatus';

export interface CreateProjectInput {
  title: string;
  description: string;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  status?: ProjectStatus;
}

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Result<Project>> {
    try {
      // 1. ✅ Vérifie que tous les champs obligatoires sont présents
      if (!input.title?.trim()) {
        return err(new ValidationError('The title field is required', 'title'));
      }
      if (!input.description?.trim()) {
        return err(new ValidationError('The description field is required', 'description'));
      }
      if (!input.customerId?.trim()) {
        return err(new ValidationError('The customerId field is required', 'customerId'));
      }
      if (!input.startDate) {
        return err(new ValidationError('The startDate field is required', 'startDate'));
      }

      // 2. ✅ Vérifie que startDate est une date réelle et valide
      const startDate = new Date(input.startDate);
      if (isNaN(startDate.getTime())) {
        return err(new ValidationError('The startDate is not a valid date', 'startDate'));
      }

      // 3. ✅ Vérifie que endDate est valide si fournie
      if (input.endDate) {
        const endDate = new Date(input.endDate);
        if (isNaN(endDate.getTime())) {
          return err(new ValidationError('The endDate is not a valid date', 'endDate'));
        }
        // 4. ✅ Vérifie que endDate est après startDate
        if (endDate <= startDate) {
          return err(
            new ValidationError(
              'The endDate must be after the startDate',
              'endDate'
            )
          );
        }
      }

      // 5. ✅ Vérifie que le customerId existe réellement en base
      const customerExists = await this.projectRepository.existsCustomer(input.customerId);
      if (!customerExists) {
        return err(
          new ValidationError(
            `No customer found with ID "${input.customerId}", please provide a valid customer ID`,
            'customerId'
          )
        );
      }

      // 6. ✅ Vérifie si ce customer est déjà attaché à un project avec le même titre
      const projectExists = await this.projectRepository.existsByCustomerAndTitle(
        input.customerId,
        input.title
      );
      if (projectExists) {
        return err(
          new ValidationError(
            `Customer "${input.customerId}" is already attached to a project titled "${input.title}"`,
            'title'
          )
        );
      }

      // 7. ✅ Crée le project avec les données validées
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