import { ObjectId } from "mongodb";

export interface Material {
  _id: ObjectId;
  nome: string;
  quantidade: number;
}