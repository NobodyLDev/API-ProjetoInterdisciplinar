import { PrismaClient } from '@prisma/client';
import { IHistory } from '../models/history';

// A Pessoa 5 (Infra) vai disponibilizar essa instância do Prisma aqui:
import { prisma } from '../config/database'; 

export class HistoryRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async create(data: IHistory) {
    return await this.prisma.history.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        metadata: data.metadata,
      },
    });
  }

  async findAll() {
    return await this.prisma.history.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEntity(entity: string) {
    return await this.prisma.history.findMany({
      where: { entity },
      orderBy: { createdAt: 'desc' },
    });
  }
}