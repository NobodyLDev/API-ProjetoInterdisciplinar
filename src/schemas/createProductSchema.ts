export const createProductSchema = {
  nome: {
    required: true,
    type: "string",
  },
  quantidade: {
    required: true,
    type: "number",
    min: 1,
  },
  materiais: {
    required: true,
    type: "array",
    items: {
      materialId: { required: true, type: "string" },
      quantidade: { required: true, type: "number", min: 1 },
    },
  },
};