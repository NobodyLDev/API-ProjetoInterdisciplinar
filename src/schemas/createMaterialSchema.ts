export const createMaterialSchema = {
  nome: {
    required: true,
    type: "string",
  },
  quantidade: {
    required: true,
    type: "number",
    min: 0,
  },
};
