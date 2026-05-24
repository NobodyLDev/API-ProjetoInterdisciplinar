export interface IHistory {
  id?: string;
  action: 'CREATE' | 'DELETE' | 'SIMULATION';
  entity: 'MATERIAL' | 'PRODUCT' | 'SIMULATION';
  entityId?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
}