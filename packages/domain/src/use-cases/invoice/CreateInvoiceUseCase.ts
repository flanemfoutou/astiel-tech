import type { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import type { IInvoiceItemRepository } from '../../repositories/IInvoiceItemRepository';
import type { IProjectServiceRepository } from '../../repositories/IProjectServiceRepository';
import { Invoice } from '../../entities/Invoice';
import { InvoiceItem } from '../../entities/InvoiceItem';
import { ok, err, type Result } from '@astiell/shared';

export interface CreateInvoiceInput {
  projetId: string;
  customerId: string;
  dateEcheance: Date;
  tauxTVA: number;
  notes?: string;
}

export class CreateInvoiceUseCase {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly invoiceItemRepository: IInvoiceItemRepository,
    private readonly projectServiceRepository: IProjectServiceRepository,
  ) {}

  async execute(input: CreateInvoiceInput): Promise<Result<Invoice>> {
    try {
      // Récupère tous les services du projet
      const projectServices = await this.projectServiceRepository.findByProjetId(input.projetId);

      if (projectServices.length === 0) {
        return err(new Error('Le projet ne contient aucun service facturable'));
      }

      // Calcule le montant HT total depuis les ProjectServices
      const montantHT = projectServices.reduce((sum, ps) => sum + ps.montantTotal, 0);

      // Crée la facture
      const invoice = Invoice.create({
        ...input,
        statut: 'BROUILLON',
        dateEmission: new Date(),
        montantHT,
      });

      const saveResult = await this.invoiceRepository.save(invoice);
      if (!saveResult.success) return saveResult;

      // Crée les InvoiceItems depuis les ProjectServices
      for (const ps of projectServices) {
        const item = InvoiceItem.create({
          invoiceId: invoice.id,
          projectServiceId: ps.id,
          designation: `Service ref. ${ps.serviceId}`,
          quantite: ps.quantite,
          prixUnitaire: ps.prixUnitaire,
        });
        await this.invoiceItemRepository.save(item);
      }

      return ok(invoice);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}