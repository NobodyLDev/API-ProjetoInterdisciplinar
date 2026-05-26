// Define a local History type to avoid depending on a missing export
export interface History {
  action: string;
  entity: string;
  description: string;
  [key: string]: any;
}

export function validateHistory(data: History) {
  if (!data.action) {
    throw new Error("Action é obrigatória");
  }

  if (!data.entity) {
    throw new Error("Entity é obrigatória");
  }

  if (!data.description) {
    throw new Error("Description é obrigatória");
  }

  return true;
}