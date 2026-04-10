import { generateId, type Id } from '@astiell/shared';
import type { ProjectStatus } from '../value-objects/ProjectStatus';

export interface ProjectProps {
  id: Id;
  title: string;
  description: string;
  status: ProjectStatus;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Project {
  private constructor(private readonly props: ProjectProps) {}

  static create(props: Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const now = new Date();
    return new Project({
      ...props,
      id: generateId('prt'),  // ✅ "prt_<uuid>"
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ProjectProps): Project {
    return new Project(props);
  }

  get id() { return this.props.id; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get status() { return this.props.status; }
  get customerId() { return this.props.customerId; }
  get startDate() { return this.props.startDate; }
  get endDate() { return this.props.endDate; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  close(): Project {
    return new Project({
      ...this.props,
      status: 'TERMINE',
      endDate: new Date(),
      updatedAt: new Date(),
    });
  }

  toPlain(): ProjectProps {
    return { ...this.props };
  }
}