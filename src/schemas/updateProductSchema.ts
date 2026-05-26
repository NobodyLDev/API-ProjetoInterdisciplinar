export const updateProductSchema = {
  nome: {
    required: false,
    type: "string",
  },
  materiais: {
    required: false,
    type: "array",
    items: {
      materialId: { required: true, type: "number" },
      quantidade: { required: true, type: "number", min: 1 },
    },
  },
};