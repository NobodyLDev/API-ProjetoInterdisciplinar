import { ObjectId } from "mongodb";

export interface ProductMaterial {
  materialId: string;
  quantidade: number;
}

export interface Product {
  _id?: ObjectId;
  nome: string;
  quantidade: number;
  materiais: ProductMaterial[];
}