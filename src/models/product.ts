export interface ProductMaterial {
  materialId: number;
  quantidade: number;
}

export interface Product {
  id: number;
  nome: string;
  materiais: ProductMaterial[];
}