export const updateProductSchema = {
  nome: {
    required: false,
    type: "string",
  },
  quantidade: {
    required: false,
    type: "number",
    min: 1,
  },
  materiais: {
    required: false,
    type: "array",
    items: {
      materialId: { required: true, type: "string" },
      quantidade: { required: true, type: "number", min: 1 },
    },
  },
};