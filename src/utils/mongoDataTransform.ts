import { ObjectId } from "mongodb";

/**
 * Transforma _id do MongoDB para id (string)
 * Mantém _id original nos dados retornados
 */
export function transformMongoData(data: any): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => transformSingleData(item));
  }

  return transformSingleData(data);
}

function transformSingleData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const transformed = { ...data };

  if (data._id instanceof ObjectId) {
    transformed.id = data._id.toString();
  }

  return transformed;
}
